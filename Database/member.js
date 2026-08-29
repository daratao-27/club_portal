const { Schema, model } = require('mongoose');

// Define the Member schema
const MemberSchema = new Schema({

    // Define the fields for the Member schema
    name: {
        type: String, // The name field is of type String
        required: true // The name field is required
    },

    email: {
        type: String, // The email field is of type String
        required: true, // The email field is required
        unique: true // The email field must be unique
    },

    role: {
        type: String, // The role field is of type String
        required: true, // The role field is required
        enum: ['president', 'member', 'secretary'] // The role field can only be 'president', 'member', or 'secretary'
    },

    password: {
        type: String, // The password field is of type String
        required: true // The password field is required
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create the Member model using the Member schema
// The first argument is the singular name of the collection that will be created in the database
// The second argument is the schema to use for this model.
// The 3rd argument is the name of the collection in the database. If not provided, Mongoose will use the pluralized version.
const Member = model('Member', MemberSchema, 'member');

module.exports = Member;