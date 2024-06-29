async function connect(){

    if(global.connection)
        return global.connection.connect();

    const { Pool } = require('pg');
    const pool = new Pool({
        connectionString: process.env.CONNECTION_STRING
    });

    const client = await pool.connect();
    console.log('Criou o pool de conexao');

    const res = await client.query('select now()');
    console.log(res.rows[0]);
    client.release();

    global.connection = pool;
    return pool.connect();

}

connect();

async function selectCustomers(name){
    const client = await connect();
    const res = await client.query('SELECT nom_paciente, cod_paciente, num_cpf FROM arq_paciente WHERE nom_paciente ILIKE $1', [`%${name}%`]);
    return res.rows;
}

async function insertUser(login, senha, cod_paciente) {
    const client = await connect();
    const res = await client.query('INSERT INTO usuarios (login, senha, cod_paciente) VALUES ($1, $2, $3)', [login, senha, cod_paciente]);
    client.release();
    return res.rowCount;
}

/*async function insertUser(login, senha, cod_paciente) {
    const client = await connect();
    
    const res = await client.query(`
        INSERT INTO usuarios (login, senha, cod_paciente) 
        VALUES ($1, $2, $3)
        ON CONFLICT (cod_paciente) 
        DO UPDATE SET login = excluded.login, senha = excluded.senha
    `, [login, senha, cod_paciente]);
    client.release();
    return res.rowCount;
}*/

async function authenticateUser(login, senha) {
    const client = await connect();
    const res = await client.query('SELECT * FROM usuarios WHERE login = $1 AND senha = $2', [login, senha]);
    client.release();
    return res.rows[0];
}

async function selectUserDetails(cod_paciente) {
    const client = await connect();
    const res = await client.query('SELECT nom_paciente, num_cpf, des_email FROM arq_paciente WHERE cod_paciente = $1', [cod_paciente]);
    client.release();
    return res.rows[0];
}

async function insertFile(nome_arquivo, caminho_arquivo, cod_paciente) {
    const client = await connect();
    const res = await client.query('INSERT INTO arquivos (nome_arquivo, caminho_arquivo, cod_paciente) VALUES ($1, $2, $3)', [nome_arquivo, caminho_arquivo, cod_paciente]);
    client.release();
    return res.rowCount;
}

async function selectFiles(cod_paciente) {
    const client = await connect();
    const res = await client.query('SELECT nome_arquivo, caminho_arquivo FROM arquivos WHERE cod_paciente = $1', [cod_paciente]);
    client.release();
    return res.rows;
}

async function selectMedicos() {
    const client = await connect();
    const res = await client.query('SELECT nom_medico FROM arq_medico');
    return res.rows;
}

async function selectTiposExames() {
    const client = await connect();
    const res = await client.query('SELECT nome FROM tipos_exames');
    return res.rows;
}


module.exports = {
    selectCustomers,
    insertUser,
    authenticateUser,
    selectUserDetails,
    insertFile,
    selectFiles,
    selectMedicos,
    selectTiposExames,
}