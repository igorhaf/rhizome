const { Sequelize } = require('sequelize');
const config = require('../config/config.json'); // Ajuste o caminho conforme necessário

const sequelize = new Sequelize(config.development);

module.exports = sequelize;
