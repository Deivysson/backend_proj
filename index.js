require('dotenv').config();

const db = require('./db');

const port = process.env.PORT;

const express = require('express');

const bodyParser = require('body-parser');


const cors =require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/usuarios', async (req, res) => {
    const { login, senha } = req.body;
    const rowsAffected = await db.insertUser(login, senha);
    if (rowsAffected > 0) {
        res.status(200).json({ message: 'Login e senha salvos com sucesso!' });
        console.log();
    } else {
        res.status(500).json({ message: 'Erro ao salvar login e senha.' });
        console.log();
    }
});

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