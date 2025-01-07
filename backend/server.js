const app = require('./app');
const sequelize = require('./config/db'); // Sequelize instance
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Connect to DB and start server
sequelize.sync({ force: false }) // Create tables if they don't exist
  .then(() => {
    console.log('Connected to the database!');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });
