const mongoose = require("mongoose");

// TODO: Install `mongoose-unique-validator` for user-friendly duplicate key errors
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("User", userSchema);
