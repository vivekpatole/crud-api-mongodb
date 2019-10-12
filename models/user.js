// Module dependency
let mongoose = require("mongoose");

// Create User Schema
let userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String},
    gender: { type: String},
    age: { type: Number}
});

// Create a model for userSchema
let User = mongoose.model("User", userSchema);

// Expose User model
module.exports = User;