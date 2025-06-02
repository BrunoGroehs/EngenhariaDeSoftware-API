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

# Documentação do Projeto

## 1. Visão Geral

Esta API tem como objetivo gerenciar usuários e tarefas, fornecendo autenticação JWT, escrita em Node.js com Express e PostgreSQL. O sistema é voltado para controle de atividades, atribuição de tarefas e gestão de usuários, podendo ser utilizado em ambientes acadêmicos ou corporativos.

## 2. Decisões Arquiteturais

- **Arquitetura em camadas**: Separação clara entre controllers, models, middlewares e rotas, facilitando manutenção e testes.
- **Padrão MVC**: Controllers tratam lógica de negócio, models acessam dados, rotas expõem endpoints.
- **Mock de banco para testes**: Durante testes, o banco é simulado, permitindo execução sem dependências externas.
- **Autenticação JWT**: Segurança nas rotas protegidas.
- **Middlewares reutilizáveis**: Logger, autenticação e tratamento global de erros.

## 3. Modelagem de Dados

### Diagrama (lógico)

```
USERS
- id (PK)
- name
- email (único)
- password_hash
- created_at
- deleted_at

TASKS
- id (PK)
- title
- description
- status
- assigned_to (FK -> USERS.id)
- created_at
- updated_at
- deleted_at
```

### Descrição das Tabelas
- **users**: Armazena dados dos usuários, incluindo nome, email, hash da senha, datas de criação e deleção lógica.
- **tasks**: Armazena tarefas, com título, descrição, status, usuário responsável (assigned_to), datas de criação, atualização e deleção lógica.

## 4. Fluxo de Requisições

### Principais Endpoints

#### Usuários
- `POST /users` — Cria um novo usuário
- `GET /users/:id` — Busca usuário por ID (autenticado)
- `PUT /users/:id` — Atualiza usuário (autenticado)
- `DELETE /users/:id` — Remove usuário (soft delete, autenticado)

#### Autenticação
- `POST /auth/login` — Login (retorna JWT)
- `POST /auth/logout` — Logout

#### Tarefas
- `POST /tasks` — Cria nova tarefa (autenticado)
- `GET /tasks/:id` — Busca tarefa por ID (autenticado)
- `GET /tasks?assignedTo=ID` — Lista tarefas de um usuário (autenticado)
- `PUT /tasks/:id` — Atualiza tarefa (autenticado)
- `DELETE /tasks/:id` — Remove tarefa (autenticado)

#### Exemplos de Uso
Veja o arquivo `test.http` para exemplos práticos de requisições HTTP para todos os endpoints da API.

## 5. Configuração e Deploy

### Dependências
- Node.js >= 18
- PostgreSQL (apenas produção)
- npm

### Instalação
```bash
# Clone o repositório
git clone <repo-url>
cd EngenhariaDeSoftware-API
npm install
```

### Configuração do Ambiente
Crie um arquivo `.env` na raiz do projeto:
```
PORT=3000
JWT_SECRET=sua-chave-secreta
DATABASE_URL=postgres://usuario:senha@localhost:5432/seubanco
```
> Para rodar os testes, as variáveis de banco não são necessárias (o mock é usado automaticamente).

### Execução
```bash
# Produção
npm start
# Desenvolvimento
npm run dev
```
A API estará disponível em `http://localhost:3000`.

## 6. Testes Automatizados

- **Mocha** + **Chai**: Testes unitários e de integração
- **Supertest**: Testes de endpoints HTTP
- **Sinon**: Mocks e stubs
- **nyc**: Cobertura de código
- **Mock de banco**: Nenhum dado real é afetado nos testes

### Estratégia
- Testes unitários para controllers, models e middlewares
- Testes de integração para fluxos completos de usuário, tarefa e autenticação
- Cobertura mínima exigida: 80% linhas/statements/funções, 70% branches
- Mocks para banco, JWT e bcrypt garantem testes rápidos e isolados

### Execução dos Testes
```bash
npm test                # Todos os testes
npm run test:watch      # Modo watch
npm run test:coverage   # Cobertura de código
npm run coverage:report # Relatório HTML em coverage/index.html
```

### Métricas de Cobertura
- Linhas: >= 80%
- Funções: >= 80%
- Branches: >= 70%

---

**Engenharia de Software API — 2025**
