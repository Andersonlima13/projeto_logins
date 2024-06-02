const express = require('express')
const app = express()
app.set('view engine', 'ejs');
const bodyParser = require('body-parser'); // Para analisar o corpo da solicitação POST
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());
//require('dotenv').config();

app.listen(5000, () => {console.log("Servidor iniciado com sucesso!")})
app.use(express.static(__dirname));



// Criação do banco pool -> ps : alterar para .env

const { Pool } = require('pg')


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
  } catch (error) {
      console.error('Erro ao executar a consulta:', error);
      res.status(500).send('Erro ao executar a consulta.');
  }
})

*/

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