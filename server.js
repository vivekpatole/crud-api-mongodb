let express = require('express');
let bodyParser = require('body-parser');
require('dotenv').config();

// Create express app
let app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(process.env.PORT);

console.log('Express server started at http://localhost:%s', process.env.PORT);

module.exports = app;
