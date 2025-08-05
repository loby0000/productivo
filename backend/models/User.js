const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    document: String,
    // Agrega aquí los campos que necesites
});

module.exports = mongoose.model('User', userSchema);
