let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require("mongoose");
require('dotenv').config();

// Create express app
let app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Database Host Name/IP
const DB_HOST = process.env.DB_HOST;
// Database Name
const DB_NAME = process.env.DB_NAME;
// Connection URL
const DB_URL = 'mongodb://' + DB_HOST + '/' + DB_NAME;
// Connection Options
const DB_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
};
// Connect to the database
mongoose.connect(DB_URL, DB_OPTIONS)
    .then(function () {
        console.log('Connected to MongoDB at %s', DB_URL);
    })
    .catch(function (error) {
        console.log('Failed to connect Mongodb; Error: %s', error);
        process.exit();
    });


// Middleware to check authorization token
app.all("/*", checkToken, function (req, res, next) {
    next();
});

// Function to check authorization token
function checkToken(req, res, next) {
    // Extract token from headers
    let token = req.headers['authorization'];

    if (token) {    // If token exists
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }

        if (token == process.env.AUTH_TOKEN) {   // Valid token
            next();
        } else {    // Invalid token
            res.status(401);
            return res.json({ message: 'Invalid authorization token' });
        }
    } else {    // If token does not exists
        res.status(403);
        return res.json({ message: 'Authorization token is not supplied' });
    }
}

app.listen(process.env.PORT);

console.log('Express server started at http://localhost:%s', process.env.PORT);

module.exports = app;
