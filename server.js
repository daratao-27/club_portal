const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
require("dotenv").config();
const userRouter = require('./routes/userRouter');

const PORT = process.env.PORT || 5000;

mongoose.set('strictQuery', true);
mongoose.connect(process.env.DB_CONNECT)
    .then(() => console.log('MongoDb connected'))
    .catch(err => console.log(err));

// use express.json() to parse JSON bodies into JavaScript objects from incoming
app.use(express.json());

// use express.urlencoded() to parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory, allowing access to files like
app.use(express.static(path.join(__dirname, 'public'), { index: 'index.html' }));

// Use the userRouter for routes starting with /api/users
app.use('', userRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Access the application at http://localhost:${PORT}`);
});