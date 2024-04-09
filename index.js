require('dotenv').config();

const db = require('./db');

const port = process.env.PORT;

const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.json({
        message: 'funcionando!'
    })
})


app.get('/pacientes/:id', async (req, res) => {
    const paciente = await db.selectCustomer(req.params.id);
    res.json(paciente);

})


app.get('/pacientes', async (req, res) => {
    const pacientes = await db.selectCustomers();
    res.json(pacientes);

})

app.listen(port);

console.log('backend rodando');