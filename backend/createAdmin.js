const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./models/adminModel');

async function createEmergencyAdmin() {
  await mongoose.connect('mongodb://localhost:27017/test');
  const username = 'testAdmin123';
  const password = 'Admin123';
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const existing = await Admin.findOne({ username });
    if (existing) {
      console.log('El admin de emergencia ya existe.');
    } else {
      await Admin.create({ username, password: hashedPassword });
      console.log('Admin de emergencia creado:', username);
    }
  } catch (err) {
    console.error('Error creando admin:', err);
  } finally {
    await mongoose.disconnect();
  }
}

createEmergencyAdmin();
