const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const puppeteer = require('puppeteer');
const { Pool } = require('pg');
require('dotenv').config();

app.set('view engine', 'ejs');
app.use(express.static(__dirname));

// Criação do banco pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Conexão com o banco de dados
pool.connect((err, client, release) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conexão bem-sucedida com o banco de dados!');
  }
});

// Requisições HTTP
app.listen(process.env.APP_PORT, () => {
  console.log("Servidor iniciado com sucesso!");
});

app.get("/teste", async (req, res) => {
  res.render('teste');
});

app.get("/", async (req, res) => {
  res.render('Home');
});

app.get("/Home", async (req, res) => {
  res.render('index', { alunos: [] });
});

app.get("/dashboards", async (req, res) => {
  res.render('dashboards');
});

app.get("/aluno/:param", async (req, res) => {
  try {
      const param = req.params.param;
      let query, values;

      if (/^\d+$/.test(param)) {
          // Se o parâmetro for composto apenas por dígitos, considere como matrícula
          query = 'SELECT * FROM ALUNO WHERE MATRICULA = $1';
          values = [param];

          const result = await pool.query(query, values);

          if (result.rows.length === 0) {
              return res.status(404).send('Aluno não encontrado.');
          }

          const aluno = result.rows[0];
          res.render('aluno', { aluno });
      } else {
          // Caso contrário, considere como nome (usando ILIKE para case-insensitive match)
          query = 'SELECT * FROM ALUNO WHERE NOME ILIKE $1';
          values = [`%${param}%`];

          const result = await pool.query(query, values);

          if (result.rows.length === 0) {
              return res.status(404).send('Aluno não encontrado.');
          }

          const alunos = result.rows;
          res.render('rotateste', { alunos });
      }
  } catch (error) {
      console.error('Erro ao executar a consulta:', error);
      res.status(500).send('Erro ao executar a consulta.');
  }
});





app.get("/alunos", async (req, res) => {
  try {
    const query = 'SELECT * FROM ALUNO';
    const result = await pool.query(query);
    const alunos = result.rows;
    res.json(alunos);
  } catch (error) {
    console.error('Erro ao obter os dados dos alunos:', error);
    res.status(500).send('Erro ao obter os dados dods alunos.');
  }
});

















app.get("/aluno", async (req, res) => {
  try {
    const searchType = req.query.searchType;
    const param = req.query.param;

    let query, values;

    if (searchType === 'matricula') {
      query = 'SELECT * FROM ALUNO WHERE MATRICULA = $1';
      values = [param];
    } else if (searchType === 'nome') {
      query = 'SELECT * FROM ALUNO WHERE NOME ILIKE $1';
      values = [`%${param}%`];
    } else {
      return res.status(400).send('Tipo de busca inválido.');
    }

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).render('error');
    }

    if (searchType === 'matricula') {
      const aluno = result.rows[0];
      res.render('aluno', { aluno });
    } else {
      const alunos = result.rows;
      res.render('rotateste', { alunos });
    }
  } catch (error) {
    console.error('Erro ao executar a consulta:', error);
    res.status(500).send('Erro ao executar a consulta.');
  }
});
