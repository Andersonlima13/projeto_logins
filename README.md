# 📊 Consulta de Plataformas - Colégio Vila

## 👤 Autores
**Anderson Sousa**

## 🚩 Descrição do Problema

O Colégio Vila utiliza diversas plataformas educacionais para melhorar o desempenho e a interatividade dos alunos. No entanto, a grande quantidade dessas plataformas gera confusão entre alunos e profissionais da educação, dificultando o entendimento da utilidade de cada uma e quais devem ser acessadas. Isso resulta em diversos chamados relacionados à perda de senhas, esquecimento de logins e dificuldades de acesso, especialmente para aqueles com baixo letramento digital.

## 💡 Solução

O projeto **"Buscador de Logins"** foi desenvolvido para minimizar esses problemas, permitindo que funcionários da área da educação tenham acesso rápido e seguro às credenciais dos alunos através de uma base de dados. Coordenadores e auxiliares de coordenação podem buscar logins usando a matrícula do aluno, recebendo todas as informações de acesso necessárias. O setor de T.I. atua como suporte de nível 2, lidando apenas com casos de alteração de senha.

---

# ⚙️ Aspectos Técnicos

## 🔙 **Backend**
- Desenvolvido em **Node.js**, utilizando requisições HTTP simples para consultas ao banco de dados.

## 🎨 **Frontend**
- Templates **EJS** para renderização dinâmica.
- Utilização de **MD Bootstrap** e **Material UI** para ícones.

## 🗄️ **Banco de Dados**
- **PostgreSQL** para armazenar dados dos alunos (chave primária: matrícula).
- **MongoDB** para armazenar credenciais de usuários (login e senha).

## 🚀 **Hospedagem**
- Executado localmente com **PM2**.

## 📋 **Template**
- **AdminLTE 3** para agilizar o desenvolvimento da interface.

---

# 🧩 Funcionalidades

## 📊 **Dashboard Inicial**
- Exibe o desempenho da escola em olímpiadas e análises de dados.

## 🔍 **Buscador de Logins**
- Busca por nome ou matrícula, gerando um **"Card do Aluno"** com:
  - Listagem de plataformas por série e credenciais.
  - Indicação de acesso não disponível ("null" ou "não possui acesso").
  - Opção de download do card em **PDF**.

## 👥 **Gerenciamento de Alunos** *(Somente para T.I.)*
- Importação de planilhas para cadastro de alunos.
- Restrição para matrículas duplicadas.

## 🔑 **Criação de Usuários** *(Somente para T.I.)*
- Perfis disponíveis:
  - **Direção**
  - **T.I.**
  - **Coordenação**
- Cada perfil possui permissões específicas para busca, inserção de dados e criação de usuários.

---

# 🔐 Permissões de Acesso

- **T.I.:** Acesso total, incluindo gestão de usuários e dados.
- **Direção:** Acesso a buscas e dashboards, sem permissão para criar usuários ou inserir alunos.
- **Coordenação:** Acesso restrito a algumas páginas de dashboard e buscas.

---

# 🚀 Atualizações Futuras

- ✅ Permitir que alunos consultem suas próprias credenciais.
- ✅ Integração de login com o **Google**.
- ✅ Inclusão de informações para auxiliar o acesso às plataformas.
- ✅ Listagem e enturmamento de alunos, com possibilidade de alteração de turmas.
- ✅ Edição de credenciais diretamente pelo Buscador de Logins para manter os dados atualizados.



