const express = require('express')
const app = express()
app.set('view engine', 'ejs');
const bodyParser = require('body-parser'); // Para analisar o corpo da solicitação POST
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());
require('dotenv').config();
//const archiver = require('archiver');
const path = require('path');
const puppeteer = require('puppeteer');
const ejs = require('ejs');
app.listen(process.env.APP_PORT, () => {console.log("Servidor iniciado com sucesso!")})
app.use(express.static(__dirname));
//const fs = require('fs');




// Criação do banco pool -> ps : alterar para .env

const { Pool } = require('pg')
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});



 // CONEXAO DB 
pool.connect((err, client, release) => {
    if (err) {
      console.error('Erro ao conectar ao banco de dados:', err);
    } else {
      console.log('Conexão bem-sucedida com o banco de dados!');

    }
  });

// ---------------------------------- REQUISIÇÕES HTTP ------------------------------ // 



// renderizar pagina inicial 
/// OBS : MUDAR PARA EJS
/* app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
*/

app.get("/", async (req,res) => {
  res.render('index')
} )

app.get("/teste", async (req,res) => {
  res.render('teste')
} )






// CONSULTA DE TESTE DO BANCO DE DADOS , IRÁ RETORNAR TODOS OS ALUNOS CADASTRADOS NO BANCO DE DADOS

/*  app.get("/Aluno", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM ALUNO');
        // 
        const alunos = result.rows;
        
        res.send(alunos);
        res.render('todos', {alunos})

    } catch (error) {
        console.error('Erro ao executar a consulta:', error);
        res.status(500).send('Erro ao executar a consulta.');
    }
})

/*

// Requisição de busca de alunos pela matricula
/*
app.get("/aluno/:matricula", async (req, res) => {
  try {
      const matricula = req.params.matricula;
      const query = 'SELECT * FROM ALUNO WHERE MATRICULA = $1';
      const result = await pool.query(query, [matricula]);

      if (result.rows.length === 0) {
          return res.status(404).send('Aluno não encontrado.');
      }

      const aluno = result.rows[0];
      res.send(aluno); // Objeto aluno
  } catch (error) {
      console.error('Erro ao executar a consulta:', error);
      res.status(500).send('Erro ao executar a consulta.');
  }
});
*/

// método get matriculas , faz uma requisição ao banco de dados , com a matricula que foi passada como input

/*app.get("/aluno/:matricula", async (req, res) => {
  try {
      const matricula = req.params.matricula;
      const query = 'SELECT * FROM ALUNO WHERE MATRICULA = $1';
      const result = await pool.query(query, [matricula]);

      if (result.rows.length === 0) {
          return res.status(404).send('Aluno não encontrado.');
      }

      const aluno = result.rows[0];
      

      // resultado renderizado na view aluno
      res.render('aluno', { aluno });

  } catch (error) {
      console.error('Erro ao executar a consulta:', error);
      res.status(500).send('Erro ao executar a consulta.');
  }
});


*/


// metodo para buscar aluno por nome ou matricula 

app.get("/aluno/:parametro", async (req, res) => {
  try {
      const parametro = req.params.parametro;
      const isMatricula = !isNaN(parametro); // Verifica se o parâmetro é uma matrícula

      let query;
      let values;
      if (isMatricula) {
          query = 'SELECT * FROM ALUNO WHERE MATRICULA = $1';
          values = [parametro];
      } else {
          query = 'SELECT * FROM ALUNO WHERE NOME ILIKE $1'; // ILIKE para busca case-insensitive
          values = [`%${parametro}%`];
      }

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
          return res.status(404).send('Aluno não encontrado.');
      }

      const aluno = result.rows[0];
      
      // Renderizar o resultado na view aluno
      res.render('aluno', { aluno });

  } catch (error) {
      console.error('Erro ao executar a consulta:', error);
      res.status(500).send('Erro ao executar a consulta.');
  }
});












