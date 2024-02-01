const { DataTypes, Model } = require('sequelize');
const sequelize = require('./index'); // Ajuste o caminho para o arquivo index.js

class Graph extends Model {}

Graph.init({
    data: DataTypes.TEXT
}, { sequelize, modelName: 'graph' });

module.exports = Graph;
