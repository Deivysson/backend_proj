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

async function selectCustomers(){
    const client = await connect();
    const res = await client.query('SELECT nom_paciente FROM arq_paciente');
    return res.rows;
}

async function selectCustomer(id){
    const client = await connect();
    const res = await client.query('SELECT nom_paciente FROM arq_paciente WHERE ID=$1', [id]);
    return res.rows;
}

module.exports = {
    selectCustomers,
    selectCustomer
}