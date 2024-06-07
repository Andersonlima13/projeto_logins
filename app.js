

const express = require('express')
const app = express()
app.set('view engine', 'ejs');
const bodyParser = require('body-parser'); // Para analisar o corpo da solicitação POST
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());
require('dotenv').config();
const archiver = require('archiver');
const path = require('path');
const puppeteer = require('puppeteer');
const ejs = require('ejs');
app.listen(process.env.APP_PORT, () => {console.log("Servidor iniciado com sucesso!")})
app.use(express.static(__dirname));
const fs = require('fs');




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


*/

// Requisição de busca de alunos pela matricula


// método get matriculas , faz uma requisição ao banco de dados , com a matricula que foi passada como input

app.get("/aluno/:matricula", async (req, res) => {
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

app.get("/alunos", async (req, res) => {
    try {
      const query = 'SELECT * FROM ALUNO';
      const result = await pool.query(query);
      const alunos = result.rows;
      res.json(alunos);
    } catch (error) {
      console.error('Erro ao obter os dados dos alunos:', error);
      res.status(500).send('Erro ao obter os dados dos alunos.');
    }
  });



  app.get("/downloadAllPDFs", async (req, res) => {
    try {
      const query = 'SELECT * FROM ALUNO';
      const result = await pool.query(query);
      const alunos = result.rows;
  
      const tempDir = './tempPDFs';
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }
  
      // Gerar HTML e salvar temporariamente
      for (const aluno of alunos) {
        const html = `
          <html>
            <head>
              <title>Informações do Aluno</title>
            </head>
            <body>
              <h1>${aluno.nome}</h1>
              <p>Matrícula: ${aluno.matricula}</p>
              <!-- Adicione outras informações do aluno conforme necessário -->
            </body>
          </html>
        `;
        const htmlPath = `${tempDir}/${aluno.matricula}.html`;
        fs.writeFileSync(htmlPath, html);
      }
  
      // Compactar os HTMLs em um arquivo ZIP
      const output = fs.createWriteStream('./tempPDFs/allHTMLs.zip');
      const archive = archiver('zip', { zlib: { level: 9 } });
      archive.pipe(output);
      archive.directory(tempDir, false);
      archive.finalize();
  
      // Enviar o arquivo ZIP para o cliente
      res.download('./tempPDFs/allHTMLs.zip', 'allHTMLs.zip', () => {
        // Após o download, excluir o diretório temporário e o arquivo ZIP
        fs.rmdirSync(tempDir, { recursive: true });
        fs.unlinkSync('./tempPDFs/allHTMLs.zip');
      });
    } catch (error) {
      console.error('Erro ao gerar e baixar PDFs:', error);
      res.status(500).send('Erro ao gerar e baixar PDFs.');
    }
  });

  app.get("/aluno/nome/:nome", async (req, res) => {
    try {
      const nome = req.params.nome;
      // Use uma consulta SQL que filtre os alunos pelo nome
      const query = 'SELECT * FROM ALUNO WHERE LOWER(nome) LIKE $1';
      const result = await pool.query(query, [`%${nome.toLowerCase()}%`]);
  
      if (result.rows.length === 0) {
        return res.status(404).send('Aluno não encontrado.');
      }
  
      const aluno_nome = result.rows;
  
      // Renderiza uma visualização com os detalhes dos alunos
      res.render('aluno_nome', { aluno_nome });
  
    } catch (error) {
      console.error('Erro ao executar a consulta:', error);
      res.status(500).send('Erro ao executar a consulta.');
    }
  });


  




