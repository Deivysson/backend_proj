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
    const usuario = { login: req.body.login, senha: req.body.senha, cod_paciente: req.body.cod_paciente };
   

    const rowsAffected = await db.insertUser(usuario.login, usuario.senha, usuario.cod_paciente);
    if (rowsAffected > 0) {
        res.status(200).json({ message: 'Login e senha salvos com sucesso!' });
        
    } else {
        res.status(500).json({ message: 'Erro ao salvar login e senha.' });
     
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

app.post('/authenticate', async (req, res) => {
    const { login, senha } = req.body;
    const user = await db.authenticateUser(login, senha);
    if (user) {
        res.status(200).json({ message: 'Autenticação bem-sucedida!', user });
    } else {
        res.status(401).json({ message: 'Login ou senha inválidos.' });
    }
});

app.get('/exames', async (req, res) => {
    const cod_paciente = req.query.cod_paciente;
    const exames = await db.selectUserDetails(cod_paciente);
    if (exames) {
        res.status(200).json({ message: 'Dados inseridos corretamente.', exames });
    } else {
        res.status(401).json({ message: 'Dados invalidos.' });
    }
});


app.listen(port);

console.log('backend rodando');