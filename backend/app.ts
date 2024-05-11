import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { Sequelize } from 'sequelize';
import tabsRoutes from './routes/tabsRoutes';
import graphRoutes from './routes/graphsRoutes';
import objectifRoutes from './routes/objectifRoutes';
import config from './config/config.json';

const app = express();
const port = 8080;

const user = 'nexabuild';
const password = 'nexabuild';
const database = 'admin';
const host = 'localhost:27017';

app.use(express.json());
app.use(cors());

mongoose.connect(`mongodb://${user}:${password}@${host}/${database}?authSource=admin`)
.then(() => console.log('MongoDB connected...'))
.catch(err => console.error(err));

app.use('/api/graphs', graphRoutes);
app.use('/api/ifroutes', objectifRoutes);
app.use('/api/tabs', tabsRoutes);

app.get('/', (req: Request, res: Response) => res.send('Olá, Mundo!'));

const sequelize = new Sequelize(config.development);

app.listen(port, () => {
    console.log(`Aplicação Express rodando na porta ${port}`);
});
