const { Sequelize } = require("sequelize");
require("dotenv").config(); // Cargar variables de entorno

// Obtener la URL completa de conexión desde las variables de entorno
const DATABASE_URL = process.env.DATABASE_URL;

// Configuración de Sequelize con PostgreSQL en Supabase usando la connection string
const sequelize = new Sequelize(DATABASE_URL, {
    dialect: "postgres",
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
