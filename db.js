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

async function authenticateUser(login, senha) {
    const client = await connect();
    const res = await client.query('SELECT * FROM usuarios WHERE login = $1 AND senha = $2', [login, senha]);
    client.release();
    return res.rows[0];
}




module.exports = {
    selectCustomers,
    insertUser,
    authenticateUser
}