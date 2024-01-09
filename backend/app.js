const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
const userRoutes = require('./routes/api');
app.use('/api', userRoutes);
app.get('/', (req, res) => {
    res.status(200).send('Hello World!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

module.exports = app;
