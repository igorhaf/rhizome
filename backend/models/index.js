const Sequelize = require('sequelize');
const config = require('../config/config.json').development;

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: config.dialect
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importar modelos
// db.user = require('./user')(sequelize, Sequelize);

module.exports = db;
