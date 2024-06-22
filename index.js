require('dotenv').config();

const db = require('./db');

const port = process.env.PORT;

const express = require('express');

const multer = require('multer');

const bodyParser = require('body-parser');


const cors =require('cors');

const app = express();

// Configuracao do multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

/*app.use(cors());*/

app.use(cors({
    origin: '*', // Para permitir todas as origens (para desenvolvimento apenas)
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
  }));

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
        const cod_paciente = user.cod_paciente;
        const exames = await db.selectUserDetails(cod_paciente);
        res.status(200).json({ message: 'Autenticação bem-sucedida!', user, exames });
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

app.post('/upload', upload.single('arquivo'), async (req, res) => {
    const cod_paciente = req.body.cod_paciente;
    const nome_arquivo = req.file.originalname;
    const caminho_arquivo = req.file.path;

    const rowsAffected = await db.insertFile(nome_arquivo, caminho_arquivo, cod_paciente);
    if (rowsAffected > 0) {
        res.status(200).json({ message: 'Arquivo recebido com sucesso!' });
    } else {
        res.status(500).json({ message: 'Erro ao salvar o arquivo.' });
    }
});

app.get('/exames', async (req, res) => {
    const cod_paciente = req.query.cod_paciente;
    const exames = await db.selectFiles(cod_paciente);
    if (exames) {
        res.status(200).json({ exames });
    } else {
        res.status(404).json({ message: 'Nenhum exame encontrado.' });
    }
});

app.listen(port);

console.log('backend rodando');