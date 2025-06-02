# Testes Automatizados - API de Gerenciamento de Tarefas

Este projeto possui testes automatizados abrangentes usando **Mocha** e **Chai** (expect) para todas as funcionalidades principais da API.

## 📋 Funcionalidades Testadas

### 👤 **Usuários** (`test/users.test.js`)
- ✅ **POST /users** - Criar um novo usuário
- ✅ **GET /users/{id}** - Obter informações de um usuário específico
- ✅ **PUT /users/{id}** - Atualizar informações do usuário
- ✅ **DELETE /users/{id}** - Remover um usuário (soft delete)

### 📋 **Tarefas** (`test/tasks.test.js`)
- ✅ **POST /tasks** - Criar uma nova tarefa
- ✅ **GET /tasks/{id}** - Obter detalhes de uma tarefa
- ✅ **GET /tasks?assignedTo={userId}** - Listar tarefas atribuídas a um usuário
- ✅ **PUT /tasks/{id}** - Atualizar informações da tarefa
- ✅ **DELETE /tasks/{id}** - Remover uma tarefa

### 🔐 **Autenticação** (`test/auth.test.js`)
- ✅ **POST /auth/login** - Login de usuários (retorna JWT)
- ✅ **POST /auth/logout** - Logout do usuário

## 🚀 Como Executar os Testes

### Instalação de Dependências
```bash
npm install
```

### Executar Todos os Testes
```bash
npm test
```

### Executar Testes em Modo Watch
```bash
npm run test:watch
```

### Executar Testes com Cobertura
```bash
npm run test:coverage
```

### Gerar Relatório de Cobertura HTML
```bash
npm run coverage:report
```
O relatório será gerado em `coverage/index.html`

## 📊 Cobertura de Código

Os testes são configurados para exigir:
- **80%** de cobertura de linhas
- **80%** de cobertura de statements  
- **80%** de cobertura de funções
- **70%** de cobertura de branches

## 🛠️ Tecnologias Utilizadas

- **Mocha** - Framework de testes
- **Chai** - Biblioteca de assertions (expect)
- **Supertest** - Testes de API HTTP
- **Sinon** - Mocks e stubs
- **NYC** - Cobertura de código

## 📁 Estrutura dos Testes

```
test/
├── setup.js          # Configuração global dos testes
├── users.test.js      # Testes dos endpoints de usuários
├── tasks.test.js      # Testes dos endpoints de tarefas
└── auth.test.js       # Testes dos endpoints de autenticação
```

## ✅ Cenários de Teste Cobertos

Cada endpoint é testado com múltiplos cenários:

### ✅ **Casos de Sucesso**
- Operações bem-sucedidas com dados válidos
- Retorno correto de dados e status codes

### ❌ **Casos de Erro**
- Campos obrigatórios ausentes
- Dados inválidos ou malformados
- Recursos não encontrados (404)
- Erros de autenticação (401/403)
- Erros de banco de dados (500)

### 🔒 **Testes de Segurança**
- Validação de tokens JWT
- Proteção de rotas autenticadas
- Validação de autorização

## 🎯 Mocking

Os testes utilizam **mocks** para:
- Banco de dados (não fazem conexões reais)
- Funções de hash de senha (bcrypt)
- Geração de tokens JWT
- Modelos de dados

Isso garante que os testes sejam:
- ⚡ Rápidos
- 🔒 Isolados
- 🎯 Focados na lógica de negócio
- 🚫 Sem dependências externas

## 📈 Exemplos de Execução

```bash
# Executar apenas os testes de usuários
npx mocha test/users.test.js

# Executar apenas os testes de tarefas  
npx mocha test/tasks.test.js

# Executar apenas os testes de autenticação
npx mocha test/auth.test.js

# Executar com relatório detalhado
npm test -- --reporter spec

# Executar com timeout personalizado
npm test -- --timeout 5000
```
