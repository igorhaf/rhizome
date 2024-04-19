const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;
const mongoose = require('mongoose');
const tabsRoutes = require('./routes/tabsRoutes');

app.use(express.json());
app.use(cors());

const { Sequelize } = require('sequelize');
const config = require('./config/config.json');
const user = 'nexabuild';
const password = 'nexabuild';
const database = 'admin'; // ou qualquer outro banco de dados que você deseja usar
const host = 'localhost:27017'; // ou o hostname correto do seu serviço mongo no docker

mongoose.connect(`mongodb://${user}:${password}@${host}/${database}?authSource=admin`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

const userRoutes = require('./routes/api');
const objectifRoutes = require('./routes/objectifRoutes');
app.use('/api/api', userRoutes);
app.use('/ifroutes', objectifRoutes);
app.use('/tabs', tabsRoutes);
app.get('/', (req, res) => res.send('Olá, Mundo!'));

const sequelize = new Sequelize(config.development);

app.listen(port, () => {
    console.log(`Aplicação Express rodando na porta ${port}`);
});
