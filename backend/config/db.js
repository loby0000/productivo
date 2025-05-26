// backend/config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Conectado: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error de conexión: ${error.message}`.red.bold);
    process.exit(1); // Salir si falla la conexión
  }
};

module.exports = connectDB;
