# Engenharia de Software API - Testes Automatizados

## Visão Geral

Este projeto contém uma suite completa de testes automatizados usando **Mocha** com **Chai** (expect) e suporte a cobertura de código com **nyc**.

## Estrutura de Testes

```
test/
├── setup.js                    # Configuração global dos testes
├── integration.test.js          # Testes de integração
├── controllers/                 # Testes dos controladores
│   ├── authController.test.js   # Testes do controlador de autenticação
│   ├── taskController.test.js   # Testes do controlador de tarefas
│   └── userController.test.js   # Testes do controlador de usuários
├── middlewares/                 # Testes dos middlewares
│   └── authMiddleware.test.js   # Testes do middleware de autenticação
├── models/                      # Testes dos modelos
│   ├── taskModel.test.js        # Testes do modelo de tarefas
│   └── userModel.test.js        # Testes do modelo de usuários
└── utils/                       # Utilitários para testes
    └── helpers.js               # Helpers e mocks
```

## Dependências de Teste

- **mocha**: Framework de testes
- **chai**: Biblioteca de asserções (usando `expect`)
- **supertest**: Testes de API HTTP
- **sinon**: Mocks e stubs
- **nyc**: Cobertura de código

## Scripts Disponíveis

### Executar Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch (observa mudanças)
npm run test:watch

# Executar testes com cobertura de código
npm run test:coverage

# Gerar relatório de cobertura em HTML
npm run coverage:report
```

### Comandos de Teste Detalhados

```bash
# Executar apenas testes de controladores
npx mocha test/controllers/*.test.js

# Executar apenas testes de modelos
npx mocha test/models/*.test.js

# Executar apenas testes de middlewares
npx mocha test/middlewares/*.test.js

# Executar teste específico
npx mocha test/controllers/userController.test.js

# Executar com relatório detalhado
npx mocha test/**/*.test.js --reporter spec

# Executar com timeout personalizado
npx mocha test/**/*.test.js --timeout 5000
```

## Cobertura de Código

### Configuração de Cobertura

A configuração de cobertura está definida em `.nycrc.json`:

- **Linhas**: 80% mínimo
- **Declarações**: 80% mínimo
- **Funções**: 80% mínimo
- **Branches**: 70% mínimo

### Relatórios de Cobertura

Os relatórios são gerados em múltiplos formatos:
- **Console**: Exibido no terminal
- **HTML**: Gerado em `coverage/index.html`
- **LCOV**: Para integração com ferramentas CI/CD

## Mocks e Stubs

### Database Mocking

Os testes usam mocks do pool de conexão PostgreSQL para simular operações de banco de dados sem necessidade de um banco real.

### JWT Mocking

Tokens JWT são mockados para testes de autenticação, permitindo testar fluxos autenticados sem gerar tokens reais.

### Bcrypt Mocking

Operações de hash e comparação de senhas são mockadas para acelerar os testes.

## Estrutura dos Testes

### Testes de Controlador

Cada controlador possui testes para:
- ✅ Cenários de sucesso
- ❌ Cenários de erro (400, 401, 403, 404, 500)
- 🔒 Validação de autenticação
- 📝 Validação de campos obrigatórios
- 🗄️ Tratamento de erros de banco de dados

### Testes de Modelo

Cada modelo possui testes para:
- ✅ Operações CRUD básicas
- 🔍 Consultas específicas
- ❌ Tratamento de erros de banco
- 🔒 Validação de constraints

### Testes de Middleware

- 🔐 Autenticação de tokens
- ❌ Tratamento de tokens inválidos
- 🚫 Bloqueio de acesso não autorizado

### Testes de Integração

- 🔄 Fluxos completos de usuário
- 🔄 Fluxos completos de tarefas
- 🔐 Fluxos de autenticação
- ❌ Cenários de erro end-to-end

## Exemplos de Uso

### Executar Suite Completa

```bash
npm test
```

### Executar com Cobertura

```bash
npm run test:coverage
```

### Ver Relatório HTML de Cobertura

```bash
npm run coverage:report
# Abrir coverage/index.html no navegador
```

### Executar Testes Específicos

```bash
# Apenas testes de usuários
npx mocha test/controllers/userController.test.js test/models/userModel.test.js

# Apenas testes de autenticação
npx mocha test/controllers/authController.test.js test/middlewares/authMiddleware.test.js
```

## Debugging de Testes

### Executar um Teste Específico

```bash
npx mocha test/controllers/userController.test.js --grep "should create a new user successfully"
```

### Executar com Logs Detalhados

```bash
DEBUG=* npm test
```

### Executar sem Timeout

```bash
npx mocha test/**/*.test.js --timeout 0
```

## Configurações

### .mocharc.json

Configuração do Mocha:
- Timeout: 10 segundos
- Setup: `test/setup.js`
- Reporter: spec
- Recursivo: true

### .nycrc.json

Configuração de cobertura:
- Inclui: `src/**/*.js`
- Exclui: `src/server.js`, `test/**/*`
- Thresholds configurados

## CI/CD

Para integração contínua, adicione ao seu pipeline:

```yaml
# Exemplo para GitHub Actions
- name: Run Tests
  run: npm test

- name: Run Coverage
  run: npm run test:coverage

- name: Upload Coverage
  uses: codecov/codecov-action@v1
```

## Troubleshooting

### Problemas Comuns

1. **Timeout nos testes**:
   ```bash
   npx mocha test/**/*.test.js --timeout 15000
   ```

2. **Problemas de mock**:
   - Verificar se stubs estão sendo resetados no `afterEach`
   - Verificar ordem de importação dos módulos

3. **Cobertura baixa**:
   - Executar `npm run coverage:report` e abrir HTML
   - Identificar linhas não cobertas
   - Adicionar testes específicos

### Logs de Debug

Para ver logs durante os testes:
```javascript
// No arquivo de teste
console.log('Debug info:', variableName);
```

## Contribuindo

Ao adicionar novos recursos:

1. ✅ Escreva testes para novos controladores
2. ✅ Escreva testes para novos modelos
3. ✅ Mantenha cobertura acima dos thresholds
4. ✅ Execute `npm test` antes de commit
5. ✅ Verifique cobertura com `npm run test:coverage`
