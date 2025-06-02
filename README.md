# Engenharia de Software API

## Visão Geral

Esta API foi desenvolvida para gerenciar usuários e tarefas, com autenticação JWT, escrita em Node.js usando Express e PostgreSQL. O projeto segue boas práticas de arquitetura, separando controllers, models, middlewares e rotas.

## Sumário
- [Funcionalidades](#funcionalidades)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Execução](#execução)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Rotas da API](#rotas-da-api)
- [Testes Automatizados](#testes-automatizados)
- [Exemplos de Uso (test.http)](#exemplos-de-uso)

---

## Funcionalidades
- Cadastro, autenticação e remoção de usuários
- Criação, listagem, atualização e remoção de tarefas
- Autenticação JWT
- Middleware de logging e tratamento de erros
- Testes automatizados (unitários e integração) com dados mockados

## Instalação

```bash
# Clone o repositório
 git clone <repo-url>
 cd EngenhariaDeSoftware-API

# Instale as dependências
 npm install
```

## Configuração

Crie um arquivo `.env` na raiz do projeto com as variáveis:

```
PORT=3000
JWT_SECRET=sua-chave-secreta
DATABASE_URL=postgres://usuario:senha@localhost:5432/seubanco
```

> Para rodar os testes, as variáveis de banco não são necessárias (o mock é usado automaticamente).

## Execução

```bash
# Rodar em modo produção
npm start

# Rodar em modo desenvolvimento (com nodemon)
npm run dev
```

A API estará disponível em `http://localhost:3000`.

## Estrutura de Pastas

```
├── src/
│   ├── app.js                # Configuração principal do Express
│   ├── server.js             # Inicialização do servidor
│   ├── controllers/          # Lógica dos endpoints
│   ├── db/                   # Conexão com o banco de dados (mock para testes)
│   ├── middlewares/          # Middlewares de autenticação, logger, etc
│   ├── models/               # Acesso a dados (usuários, tarefas)
│   └── routes/               # Definição das rotas
├── test/                     # Testes automatizados
│   ├── setup.js              # Configuração global dos testes
│   ├── helpers/              # Mocks e helpers para testes
│   ├── controllers/          # Testes unitários dos controllers
│   ├── middlewares/          # Testes unitários dos middlewares
│   ├── db/                   # Testes do mock do banco
│   └── *.integration.test.js # Testes de integração
├── test.http                 # Exemplos de requisições para testar a API
├── package.json
├── README.md
└── .env.example
```

## Rotas da API

### Usuários
- `POST /users` — Cria um novo usuário
- `GET /users/:id` — Busca usuário por ID (autenticado)
- `PUT /users/:id` — Atualiza usuário (autenticado)
- `DELETE /users/:id` — Remove usuário (soft delete, autenticado)

### Autenticação
- `POST /auth/login` — Login (retorna JWT)
- `POST /auth/logout` — Logout

### Tarefas
- `POST /tasks` — Cria nova tarefa (autenticado)
- `GET /tasks/:id` — Busca tarefa por ID (autenticado)
- `GET /tasks?assignedTo=ID` — Lista tarefas de um usuário (autenticado)
- `PUT /tasks/:id` — Atualiza tarefa (autenticado)
- `DELETE /tasks/:id` — Remove tarefa (autenticado)

## Testes Automatizados

- **Mocha** + **Chai** para testes unitários e de integração
- **Supertest** para testes de endpoints HTTP
- **Sinon** para mocks/stubs
- **nyc** para cobertura de código
- Banco de dados é sempre mockado nos testes (não afeta dados reais)

### Executando os testes

```bash
# Todos os testes
npm test

# Testes em modo watch
npm run test:watch

# Testes com cobertura de código
npm run test:coverage

# Relatório de cobertura em HTML
npm run coverage:report
```

## Exemplos de Uso

Veja o arquivo `test.http` para exemplos práticos de requisições HTTP para todos os endpoints da API. Você pode usar o VS Code REST Client ou Insomnia/Postman copiando os exemplos.

---

## Observações
- O projeto é totalmente testável sem banco real.
- Para produção, configure corretamente o `.env` e o banco PostgreSQL.
- Siga as mensagens de erro retornadas pela API para facilitar o debug.

---

**Engenharia de Software API — 2025**
