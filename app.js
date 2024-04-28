const express = require('express')
const app = express()

app.get("/", async (req,res) => {
    res.send("javsacript maldito")
}) 

app.listen(8000,() => {
    console.log("servidor rodando na porta 8080")
})

const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'PLATAFORMAS_ALUNOS',
    password: '12345',
    port:5432,
})

pool.connect((err, client, release) => {
    if (err) {
      console.error('Erro ao conectar ao banco de dados:', err);
    } else {
      console.log('Conexão bem-sucedida com o banco de dados!');
      // A partir daqui, você pode realizar consultas ao banco de dados
    }
  });

  async function consultarAlunos() {
    try {
      await client.connect(); // Conectar ao banco de dados
  
      // Executar consulta SQL
      const result = await client.query('SELECT * FROM aluno');
  
      // Exibir o resultado no console
      console.log('Resultado da consulta:');
      console.table(result.rows); // Mostra os resultados em formato de tabela
  
      await client.end(); // Encerrar conexão com o banco de dados
    } catch (err) {
      console.error('Erro ao consultar alunos:', err);
    }
  }
  
  // Chamar a função para consultar os alunos
consultarAlunos();