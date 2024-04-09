require('dotenv').config();

const db = require('./db');

const port = process.env.PORT;

const express = require('express');
const cors =require('cors');

const app = express();

app.use(cors());

app.get('/', (req, res) => {
    res.json({
        message: 'funcionando'
    })
})



app.get('/pacientes/search', async (req, res) => {
    const pacientes = await db.selectCustomers(req.query.name);
    res.json(pacientes);

})

app.listen(port);

console.log('backend rodando');