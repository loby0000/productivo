const mongoose = require('mongoose');
const User = require('./models/userModel');

mongoose.connect('mongodb://localhost:27017/test')
  .then(() => {
    console.log('Conectado a MongoDB');
    return User.create({
      username: 'testuser',
      documentNumber: '123456',
      userType: 'admin',
    });
  })
  .then(() => {
    console.log('Usuario creado');
    mongoose.disconnect();
  })
  .catch(err => {
    if (err.code === 11000) {
      console.error('Error: El usuario ya existe en la base de datos.');
    } else {
      console.error(err);
    }
    mongoose.disconnect();
  });