const express = require('express')
const app = express()

app.get("/", async (req,res) => {
    res.send("PAGINA INICIAL AQUI")
}) 

app.listen(8000,() => {
    console.log("Servidor iniciado com sucesso: http://localhost:8000")
})

const { Pool } = require('pg')


// MUDAR PARA DOTENV

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'PLATAFORMAS_ALUNOS',
    password: '12345',
    port:5432,
})


 // CONEXAO DB
pool.connect((err, client, release) => {
    if (err) {
      console.error('Erro ao conectar ao banco de dados:', err);
    } else {
      console.log('Conexão bem-sucedida com o banco de dados!');

    }
  });



// CONSULTA DE TESTE DO BANCO DE DADOS , IRÁ RETORNAR TODOS OS ALUNOS CADASTRADOS NO BANCO DE DADOS
  app.get("/Aluno", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM ALUNO');
        // 
        const alunos = result.rows;
        
        res.send(alunos);
    } catch (error) {
        console.error('Erro ao executar a consulta:', error);
        res.status(500).send('Erro ao executar a consulta.');
    }
});