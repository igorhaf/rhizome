import { DataTypes, Model } from 'sequelize';
import sequelize from './index'; // Ajuste o caminho para o arquivo index.js

class Graph extends Model {}

Graph.init({
    data: DataTypes.TEXT
}, { sequelize, modelName: 'graph' });

export default Graph;
