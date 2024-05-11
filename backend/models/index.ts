import { Sequelize } from 'sequelize';
import config from '../config/config.json'; // Ajuste o caminho conforme necessário

const sequelize = new Sequelize(config.development);

export default sequelize;