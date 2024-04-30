import express from 'express';
import cors from 'cors';
import tabsRoutes from './routes/tabsRoutes';
import graphRoutes from './routes/graphsRoutes';
import objectifRoutes from './routes/objectifRoutes';

const app = express();
const port = 8080;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/graphs', graphRoutes);
app.use('/api/ifroutes', objectifRoutes);
app.use('/api/tabs', tabsRoutes);
app.get('/', (req, res) => res.send('Olá, Mundo!'));

app.listen(port, () => {
    console.log(`Aplicação Express rodando na porta ${port}`);
});
