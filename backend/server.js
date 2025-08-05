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

// Middleware CORS (¡debe ir antes de cualquier endpoint!)
app.use(cors({
  origin: ['http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(bodyParser.json());
app.use(mongoSanitize());
app.use(xss());

// Middleware para logging de requests
app.use((req, res, next) => {
  const start = Date.now();
  const originalUrl = req.originalUrl || req.url;
  console.log(`[${new Date().toISOString()}] ${req.method} ${originalUrl}`);
  const originalSend = res.send;
  res.send = function(body) {
    const end = Date.now();
    console.log(`[${new Date().toISOString()}] ${req.method} ${originalUrl} - Status: ${res.statusCode} - Response time: ${end - start}ms`);
    return originalSend.call(this, body);
  };
  next();
});

// Usar todas las rutas centralizadas
app.use('/api', routes);

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
