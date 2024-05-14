const express = require('express')
const app = express()
const bodyParser = require('body-parser'); // Para analisar o corpo da solicitação POST

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



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

 app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html');
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
})

app.get("/aluno/:matricula", async (req, res) => {
  try {
      const matricula = req.params.matricula;
      const query = 'SELECT * FROM ALUNO WHERE MATRICULA = $1';
      const result = await pool.query(query, [matricula]);

      if (result.rows.length === 0) {
          return res.status(404).send('Aluno não encontrado.');
      }

      const aluno = result.rows[0];
      res.send(aluno);
  } catch (error) {
      console.error('Erro ao executar a consulta:', error);
      res.status(500).send('Erro ao executar a consulta.');
  }
});

app.get("/resultado.html", (req, res) => {
  res.sendFile(__dirname + '/resultado.html');
});


app.post("/buscar-aluno", async (req, res) => {
  try {
      const matricula = req.body.matricula;
      const query = 'SELECT * FROM ALUNO WHERE MATRICULA = $1';
      const result = await pool.query(query, [matricula]);

      if (result.rows.length === 0) {
          return res.status(404).send('Aluno não encontrado.');
      }

      const aluno = result.rows[0];
      res.redirect(`/resultado.html?nome=${aluno.nome}&turma=${aluno.turma}&unidade=${aluno.unidade}&email=${aluno.email}`);
  } catch (error) {
      console.error('Erro ao buscar aluno:', error);
      res.status(500).send('Erro ao buscar aluno.');
  }
});




;