require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes');  // Importamos el index.js de rutas
const cron = require('node-cron');
const https = require('https');
const fs = require('fs');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const User = require('./models/userModel'); // Ajusta la ruta si es necesario
const cors = require('cors');
const Redis = require('ioredis');

const app = express();
const PORT = 3000;

// Configuración de Redis
const redis = new Redis({
  port: process.env.REDIS_PORT || 6379,
  host: process.env.REDIS_HOST || 'redis',
  retryStrategy: function(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 1
});

redis.on('error', (err) => {
  console.error('Error en Redis:', err);
});

redis.on('connect', () => {
  console.log('Conectado a Redis');
});

// Middleware
app.use(bodyParser.json());

// Middleware para prevenir inyecciones de MongoDB
app.use(mongoSanitize());

// Middleware para prevenir ataques XSS
app.use(xss());

// Middleware CORS
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3001', 'http://localhost:3002'];
app.use(cors({
  origin: function(origin, callback){
    // Permitir solicitudes sin origen (como las solicitudes del mismo origen)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb-dev:27017/controlacceso', {
  autoIndex: false, // Desactiva la creación automática de índices
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Conectado a la base de datos'))
  .catch(err => console.error('Error al conectar a la base de datos:', err));

// Definición del esquema de usuario
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, index: true }, // Índice definido aquí
    documentNumber: { type: String, required: true, unique: true, index: true }, // Índice definido aquí
    userType: { type: String, enum: ['admin', 'guard', 'user'], required: true },
});

// Elimina las definiciones manuales de índices redundantes
// userSchema.index({ username: 1 });
// userSchema.index({ documentNumber: 1 });

// Sincronizar índices del modelo de usuario
User.syncIndexes()
  .then(() => console.log('Índices sincronizados correctamente.'))
  .catch(err => console.error('Error al sincronizar índices:', err));

// Usar todas las rutas centralizadas
app.use('/api', routes);

// Configurar un cron job para limpiar el historial cada día a medianoche
cron.schedule('0 0 * * *', () => {
  console.log('Ejecutando tarea programada: limpieza de historial');
  // Aquí puedes agregar la lógica para limpiar el historial
});

// Solo usar nodemon en desarrollo para recarga automática
if (process.env.NODE_ENV !== 'production') {
  try {
    require.resolve('nodemon');
  } catch (e) {
    console.warn('nodemon no está instalado. Instálalo con "npm install nodemon --save-dev" para recarga automática.');
  }
}

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
