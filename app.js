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



app.get("/aluno/:matricula/download", async (req, res) => {
  try {
    const matricula = req.params.matricula;
    const query = 'SELECT * FROM ALUNO WHERE MATRICULA = $1';
    const result = await pool.query(query, [matricula]);

    if (result.rows.length === 0) {
      return res.status(404).send('Aluno não encontrado.');
    }

    const aluno = result.rows[0];

    // Configuração do Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const ejsFilePath = path.join(__dirname, 'views', 'aluno.ejs');

    // Renderiza a página aluno.ejs com os dados do aluno
    const html = await ejs.renderFile(ejsFilePath, { aluno });

    // Gera o PDF a partir do HTML renderizado
    await page.setContent(html);
    const pdfBuffer = await page.pdf({ format: 'A4' });

    // Fecha o navegador Puppeteer
    await browser.close();

    // Define os headers para o download do PDF
    res.setHeader('Content-disposition', 'attachment; filename=aluno.pdf');
    res.setHeader('Content-type', 'application/pdf');

    // Envia o PDF como resposta
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Erro ao executar a consulta:', error);
    res.status(500).send('Erro ao executar a consulta.');
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



// Requisição para retornar o html, buscando o resultado das plataformas encontradas (( MUDAR))
/*

app.get("/resultado.html", (req, res) => {
  res.sendFile(__dirname + '/resultado.html');
});
/*



// Método post para subir a matricula que foi passada como input pelo usuario

/* PS : O MÉTODO POST AQUI DEVE SUMIR , PASSANDO A RESPONSAVILIDADE DE RETORNAR AS INFORMAÇÕES
   DO USUÁRIO PELO METODO GET -> ALUNO/MATRICULA , ASSIM FICANDO EXPOSTO APENAS A MATRICULA DO 
   MESMO NA URL 
*/

/*app.post("/buscar-aluno", async (req, res) => {
  try {
      const matricula = req.body.matricula;
      const query = 'SELECT * FROM ALUNO WHERE MATRICULA = $1';
      const result = await pool.query(query, [matricula]);
      if (result.rows.length === 0) {
          return res.status(404).send('Aluno não encontrado.');
      }
// Usuário é redirecionado para o caminho da matricula passada ( com cada parametro relativo no banco de dados)
//ps -> mudar a url por segurança -> o resultado retorna os todos os dados no html , e deve retornar apenas a matricula
      const aluno = result.rows[0];
      res.redirect(`/resultado.html?nome=${aluno.nome}&serie=${aluno.serie}&unidade=${aluno.unidade}&email=${aluno.email}
      &senha_email=${aluno.senha_email}&matricula=${aluno.matricula}&senha_app=${aluno.senha_app}&sfb=${aluno.sfb}&senha_sfb=${aluno.senha_sfb}
      &richmond=${aluno.richmond}&senha_r=${aluno.senha_r}&arvore_senha=${aluno.arvore_senha}&evolucional=${aluno.evolucional}
      &senha_evo=${aluno.senha_evo}&medalhei=${aluno.medalhei}`);
  } catch (error) {
      console.error('Erro ao buscar aluno:', error);
      res.status(500).send('Erro ao buscar aluno.');
  }
});
*/



