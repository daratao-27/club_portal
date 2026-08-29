const router = require('express').Router();
const {memberSignup, memberLogin, checkRole, memberAuth} = require('../Controller/authFunctions');

// Define the route for member signup
router.post('/register-member', (req, res) => {
    memberSignup(req.body, 'member', res);
});

// Define the route for president signup
router.post('/register-president', (req, res) => {
    memberSignup(req.body, 'president', res);
});

// Define the route for member login
router.post('/login-member', (req, res) => {
    memberLogin(req.body, 'member', res);
});

// Define the route for president login
router.post('/login-president', (req, res) => {
    memberLogin(req.body, 'president', res);
});

// -----------------------------------------------------------------
// Assignment for 3rd role
// Define the route for secretary signup
router.post('/register-secretary', (req, res) => {
    memberSignup(req.body, 'secretary', res);
});

// Define the route for secretary login
router.post('/login-secretary', (req, res) => {
    memberLogin(req.body, 'secretary', res);
});

router.get('/secretary-protected', memberAuth, checkRole(['secretary']), async (req, res) => {
    return res.status(200).json(`Welcome ${req.name}`);
});
// ------------------------------------------------------------------

router.get('/public', (req, res) => {
    res.status(200).json({ message: 'Public Domain' });
});

router.get('/member-protected', memberAuth, checkRole(['member']), async (req, res) => {
    return res.status(200).json(`Welcome ${req.name}`);
});

router.get('/president-protected', memberAuth, checkRole(['president']), async (req, res) => {
    return res.status(200).json(`Welcome ${req.name}`);
});

module.exports = router;