const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL); // Utilize variáveis de ambiente para configurar

class Graph extends Model {}

Graph.init({
    data: DataTypes.TEXT
}, { sequelize, modelName: 'graph' });

module.exports = Graph;