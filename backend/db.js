const { Sequelize } = require('sequelize');
require('dotenv').config(); // Para cargar las variables de entorno desde .env

// Configuración de Sequelize con PostgreSQL
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'postgres', // Especifica que usarás PostgreSQL
    logging: false, // Cambia a true si deseas ver las consultas SQL en la consola
    pool: {
        max: 5, // Número máximo de conexiones en el pool
        min: 0, // Número mínimo de conexiones en el pool
        acquire: 30000, // Tiempo máximo en ms para intentar conectar antes de lanzar error
        idle: 10000, // Tiempo máximo que una conexión puede estar inactiva antes de ser liberada
    },
});

// Función para probar la conexión
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión exitosa a PostgreSQL con Sequelize');
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
    }
};

testConnection();

module.exports = sequelize;
