const { Sequelize } = require("sequelize");
import pg from 'pg';
require("dotenv").config(); // Cargar variables de entorno

// Configuración de Sequelize con PostgreSQL en Supabase
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    dialectModule: pg,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // Necesario para evitar errores con SSL
        },
    },
    logging: false, // Cambia a true para ver las consultas SQL en consola
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

// Función para probar la conexión
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Conexión exitosa a Supabase con Sequelize");
    } catch (error) {
        console.error("❌ No se pudo conectar a Supabase:", error);
    }
};

testConnection();

module.exports = sequelize;
