let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require("mongoose");
require('dotenv').config();

let User = require('./models/user');

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

// API to create new user
app.post('/api/user', (req, res) => {
    // Validate the request body
    let data = req.body;
    if (!data || isEmpty(data)) {
        res.status(400).send({ message: 'Request body can not be empty' });
    } else {
        // Create new user
        const user = new User(data);

        // Save new user in database
        user.save()
            .then(function (result) {
                res.status(201).send(result);
            })
            .catch(function (error) {
                res.status(500).send({ message: error.message || 'Error occured while createing new user' });
            });
    }
});

// API to get all users
app.get('/api/users', (req, res) => {
    // Read all users from database
    User.find()
        .then(function (result) {
            res.status(200).send(result);
        })
        .catch(function (error) {
            res.status(500).send({ message: error.message || 'Error occured while retrieving all users' });
        });
});

// API to get user details by id
app.get('/api/user/:id', (req, res) => {
    // Read request parameter
    let id = req.params.id;

    // Read User by given ID
    User.findById(id)
        .then(function (result) {
            if (!result) {
                return res.status(404).send({ message: 'User not found with given id: ' + id });
            }
            res.status(200).send(result);
        })
        .catch(function (error) {
            if (error.kind === 'ObjectId') {
                return res.status(404).send({ message: 'User not found with given id: ' + id });
            }
            res.status(500).send({ message: 'Error occured while retrieving user with id: ' + id });
        });
});

// API to update existing user
app.put('/api/user/:id', (req, res) => {
    // Validate the request body
    let data = req.body;
    if (!data || isEmpty(data)) {
        res.status(400).send({ message: 'Request body can not be empty' });
    }

    // Read request parameter
    let id = req.params.id;

    User.findByIdAndUpdate(id, data, { new: true })
        .then(function (result) {
            if (!result) {
                return res.status(404).send({ message: 'User not found with given id: ' + id });
            }
            res.status(200).send(result);
        })
        .catch(function (error) {
            if (error.kind === 'ObjectId') {
                return res.status(404).send({ message: 'User not found with given id: ' + id });
            }
            res.status(500).send({ message: 'Error occured while updating user with id: ' + id });
        });
});

// API to delete user record by id
app.delete('/api/user/:id', (req, res) => {
    // Read request parameter
    let id = req.params.id;

    User.findByIdAndRemove(id)
        .then(function (result) {
            if (!result) {
                return res.status(404).send({ message: 'User not found with given id: ' + id });
            }
            res.status(200).send(result);
        })
        .catch(function (error) {
            if (error.kind === 'ObjectId') {
                return res.status(404).send({ message: 'User not found with given id: ' + id });
            }
            res.status(500).send({ message: 'Error occured while deleting user with id: ' + id });
        });
});


// Function to check if object is empty or not
function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

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
