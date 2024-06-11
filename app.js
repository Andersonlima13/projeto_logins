

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





app.get("/", async (req,res) => {
  res.render('index')
} )






// Requisição de busca de alunos pela matricula


// método get matriculas , faz uma requisição ao banco de dados , com a matricula que foi passada como input
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
      

      // resultado renderizado na view aluno
      res.render('aluno', { aluno });

  } catch (error) {
      console.error('Erro ao executar a consulta:', error);
      res.status(500).send('Erro ao executar a consulta.');
  }
});

*/


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


// buscar por aluno ou por matricula 


  app.get("/aluno/:param", async (req, res) => {
    try {
        const param = req.params.param;
        let query, values;
  
        if (/^\d+$/.test(param)) {
            // Se o parâmetro for composto apenas por dígitos, considere como matrícula
            query = 'SELECT * FROM ALUNO WHERE MATRICULA = $1';
            values = [param];
        } else {
            // Caso contrário, considere como nome (usando ILIKE para case-insensitive match)
            query = 'SELECT * FROM ALUNO WHERE NOME ILIKE $1';
            values = [`%${param}%`];
        }
  
        const result = await pool.query(query, values);
  
        if (result.rows.length === 0) {
            return res.status(404).send('Aluno não encontrado.');
        }
  
        const aluno = result.rows[0];
        res.render('aluno', { aluno });
  
    } catch (error) {
        console.error('Erro ao executar a consulta:', error);
        res.status(500).send('Erro ao executar a consulta.');
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
        return res.status(404).send('Aluno não encontrado.');
      }
  
      const aluno = result.rows[0];
      res.render('aluno', { aluno });
    } catch (error) {
      console.error('Erro ao executar a consulta:', error);
      res.status(500).send('Erro ao executar a consulta.');
    }
  });







/*
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



















/*app.get("/alunos/download", async (req, res) => {
  try {
    const query = 'SELECT * FROM ALUNO';
    const result = await pool.query(query);

    if (result.rows.length === 0) {
      return res.status(404).send('Nenhum aluno encontrado.');
    }

    const alunos = result.rows;

    // Crie um arquivo ZIP temporário
    const zipPath = './alunos.zip';
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip');

    output.on('close', () => {
      // Envie o arquivo ZIP como resposta
      res.download(zipPath, 'alunos.zip', (err) => {
        if (err) {
          console.error('Erro ao enviar o arquivo ZIP:', err);
          res.status(500).send('Erro ao enviar o arquivo ZIP.');
        }
        // Remova o arquivo ZIP temporário depois de enviado
        fs.unlinkSync(zipPath);
      });
    });

    archive.pipe(output);

    // Gere PDFs para cada aluno e adicione ao arquivo ZIP
    for (let i = 0; i < alunos.length; i++) {
      const aluno = alunos[i];
      const pdfPath = path.join(__dirname, `aluno_${i}.pdf`);

      // Renderize o arquivo EJS
      const renderedHTML = ejs.renderFile(path.join(__dirname, 'views', 'aluno.ejs'), { aluno })


      // Inicie o navegador Puppeteer
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // Acesse a página renderizada e gere o PDF
      await page.setContent(renderedHTML);
      await page.pdf({ path: pdfPath, format: 'A4' });

      // Feche o navegador Puppeteer
      await browser.close();

      // Adicione o PDF ao arquivo ZIP
      archive.append(fs.createReadStream(pdfPath), { name: `aluno_${i}.pdf` });

      // Exclua o arquivo PDF temporário
      fs.unlinkSync(pdfPath);
    }

    // Finalize o arquivo ZIP
    archive.finalize();

  } catch (error) {
    console.error('Erro ao executar a consulta:', error);
    res.status(500).send('Erro ao executar a consulta.');
  }
});



*/

