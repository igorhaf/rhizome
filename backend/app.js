const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());

const { Sequelize } = require('sequelize');
const config = require('./config/config.json');

const userRoutes = require('./routes/api');
app.use('/api', userRoutes);
app.get('/', (req, res) => res.send('Olá, Mundo!'));

const sequelize = new Sequelize(config.development);

app.listen(port, () => {
    console.log(`Aplicação Express rodando na porta ${port}`);
});
