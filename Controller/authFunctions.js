const Member = require('../Database/member');
const bcrypt = require('bcrypt');
const e = require('express');
const jwt = require('jsonwebtoken');
// Load environment variables from the .env file
require("dotenv").config();

const memberSignup = async (reqBody, role, res) => {
    try {
        const { name, email, password } = reqBody;
        // const name = req.body.name;
        // const email = req.body.email;
        // const role = req.body.role;
        // const password = req.body.password;

        let nameNotTaken = await validateMemberName(name);
        if (!nameNotTaken) {
            return res.status(400).json({ message: 'Name already exists' });
        }
        // Check if the email already exists in the database
        const emailNotRegistered = await validateMemberEmail(email);
        if (!emailNotRegistered) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        // Hash the password before saving to the database
        const hashedPassword = await bcrypt.hash(password, 12);


        // Create a new member instance with the hashed password
        const newMember = new Member({
            ...reqBody,
            role,
            password: hashedPassword
        });

        // const newMember = new Member({
        //     name,
        //     email,
        //     role,
        //     password: hashedPassword
        // });

        // Save the new member to the database
        await newMember.save();

        res.status(201).json({ message: 'Member registered successfully' });
    } catch (error) {
        console.error('Error during member signup:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const validateMemberName = async (name) => {
    // let member = await Member.findOne({ name: name });
    let member = await Member.findOne({ name });
    return member ? false : true // Return true if the name is not taken, false otherwise
}

const validateMemberEmail = async (email) => {
    // let member = await Member.findOne({ email: email });
    let member = await Member.findOne({ email });
    return member ? false : true // Return true if the email is not taken, false otherwise
}

const memberLogin = async (reqBody, role, res) => {
    try {
        const { name, password } = reqBody;

        // Find the member by name
        const member = await Member.findOne({ name });

        // Check if the member exists
        if (!member) {
            return res.status(401).json({
                message: 'Member name not found. Invalid login credentials'
            });
        }

        // Check if the member's role matches the expected role
        if (member.role !== role) {
            return res.status(403).json({
                message: 'Please make sure you are logging in as the right role'
            });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, member.password);
        if (isMatch) {
            // Generate a JWT token for the authenticated member
            const token = jwt.sign(
                {
                    email: member.email,
                    name: member.name,
                    role: member.role
                },
                process.env.APP_SECRET,
                { expiresIn: '3 days' }
            );
            // Return the member details along with the token
            const result = {
                name: member.name,
                email: member.email,
                role: member.role,
                token: token,
                expiresIn: 72
            }

            return res.status(200).json({
                ...result,
                message: 'You are now logged in.'
            });
        }

        return res.status(401).json({
            message: 'Invalid login credentials'
        });
    } catch (error) {
        console.error('Error during member login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }


};

const memberAuth = (req, res, next) => {
    // extract token from request header.
    const authHeader = req.headers["authorization"];

    // If token is not provided in the header, return an error
    if (!authHeader) {
        return res.status(401).json({
            message: "Missing token."
        });
    }
    // JWT token comes in the form JWT <token>, so we split the token from the "Bearer" string
    const token = authHeader.split(" ")[1];
    try {
        // Verify the token and extract the member information from it
        const decoded = jwt.verify(token, process.env.APP_SECRET);

        // decoded is a JSON object containing the member information that we signed in the token.
        // we can attach it to the request object and pass it to the next middleware function
        req.name = decoded.name;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid/Wrong token."
        });
    }
};

const checkRole = roles => async (req, res, next) => {
    // Get the name from the request object, which was attached by the memberAuth middleware 
    // function
    let { name } = req;
    // Find the member by name from the database and check if its role is included in the roles
    // that are allowed to access this resource
    const member = await Member.findOne({ name });
    return !roles.includes(member.role)
        ? res.status(403).json({
            message: "You don't have permission to access this resource."
        })
        : next();
};

module.exports = {
    memberSignup,
    memberLogin,
    memberAuth,
    checkRole
};
