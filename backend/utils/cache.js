const Redis = require('ioredis');

const client = new Redis({
  port: process.env.REDIS_PORT || 6379,
  host: process.env.REDIS_HOST || 'redis',
  retryStrategy: function(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 1
});

client.on('error', (err) => {
  console.error('Error en Redis:', err);
});

// Guardar datos en caché
const setCache = async (key, value, expiration = 3600) => {
  try {
    await client.set(key, JSON.stringify(value), 'EX', expiration); // Expira en 1 hora por defecto
    console.log(`Datos guardados en caché con clave: ${key}`);
  } catch (err) {
    console.error('Error al guardar en caché:', err);
  }
};

// Recuperar datos del caché
const getCache = async (key) => {
  try {
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('Error al recuperar del caché:', err);
    return null;
  }
};

// Eliminar datos del caché
const deleteCache = async (key) => {
  try {
    await client.del(key);
    console.log(`Datos eliminados del caché con clave: ${key}`);
  } catch (err) {
    console.error('Error al eliminar del caché:', err);
  }
};

module.exports = { setCache, getCache, deleteCache };