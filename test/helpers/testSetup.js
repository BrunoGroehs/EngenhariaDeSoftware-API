const sinon = require('sinon');
const proxyquire = require('proxyquire');
const mockData = require('./mockData');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock database pool
const mockPool = {
  query: sinon.stub(),
  connect: sinon.stub(),
  end: sinon.stub()
};

// Setup default pool behavior
mockPool.connect.resolves({
  query: sinon.stub().resolves({ rows: [] }),
  release: sinon.stub()
});

// Mock UserModel functions
function setupUserModelMocks() {
  const userModelMock = {
    findByEmail: sinon.stub(),
    findById: sinon.stub(),
    createUser: sinon.stub(),
    updateUser: sinon.stub(),
    deleteUser: sinon.stub()
  };

  // Setup default behaviors
  userModelMock.findByEmail.callsFake(async (email) => {
    const user = mockData.getMockUserByEmail(email);
    return user || null;
  });

  userModelMock.findById.callsFake(async (id) => {
    const user = mockData.getMockUserById(id);
    return user || null;
  });

  userModelMock.createUser.callsFake(async (name, email, passwordHash) => {
    // Check if user with email already exists
    const existingUser = mockData.getMockUserByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    return mockData.createMockUser(name, email, passwordHash);
  });

  userModelMock.updateUser.callsFake(async (id, name, email) => {
    const user = mockData.getMockUserById(id);
    if (!user) {
      return null;
    }
    
    // Update user in mock data
    user.name = name || user.name;
    user.email = email || user.email;
    user.updated_at = new Date();
    
    return user;
  });

  userModelMock.deleteUser.callsFake(async (id) => {
    const user = mockData.getMockUserById(id);
    if (!user) {
      return null;
    }
    
    // Soft delete
    user.deleted_at = new Date();
    return user;
  });

  return userModelMock;
}

// Mock TaskModel functions
function setupTaskModelMocks() {
  const taskModelMock = {
    findById: sinon.stub(),
    findByUserId: sinon.stub(),
    createTask: sinon.stub(),
    updateTask: sinon.stub(),
    deleteTask: sinon.stub(),
    findAll: sinon.stub()
  };

  // Setup default behaviors
  taskModelMock.findById.callsFake(async (id) => {
    const task = mockData.getMockTaskById(id);
    return task || null;
  });

  taskModelMock.findByUserId.callsFake(async (userId) => {
    return mockData.getMockTasksByUser(userId);
  });

  taskModelMock.createTask.callsFake(async (title, description, assignedTo, createdBy) => {
    // Check if assigned user exists
    const assignedUser = mockData.getMockUserById(assignedTo);
    if (!assignedUser) {
      throw new Error('Assigned user does not exist');
    }
    
    return mockData.createMockTask(title, description, assignedTo, createdBy);
  });

  taskModelMock.findAll.callsFake(async () => {
    return mockData.mockTasks.filter(task => !task.deleted_at);
  });

  taskModelMock.updateTask.callsFake(async (id, updates) => {
    const task = mockData.getMockTaskById(id);
    if (!task) {
      return null;
    }
    
    // Update task in mock data
    Object.assign(task, updates);
    task.updated_at = new Date();
    
    return task;
  });

  taskModelMock.deleteTask.callsFake(async (id) => {
    const task = mockData.getMockTaskById(id);
    if (!task) {
      return null;
    }
    
    // Soft delete
    task.deleted_at = new Date();
    return task;
  });

  return taskModelMock;
}

// Function to create mocked app for integration tests
function createMockedApp() {
  // Reset mock data before each test
  mockData.resetMockData();
  
  const userModelMock = setupUserModelMocks();
  const taskModelMock = setupTaskModelMocks();

  // Mock bcrypt for predictable testing
  const bcryptMock = {
    ...bcrypt,
    compare: sinon.stub().callsFake(async (password, hash) => {
      // For testing purposes, we'll say 'password123' matches our mock hash
      if (password === 'password123' && hash === '$2b$10$K8eZXJ9.wKQx8Jz9vKqZEuJvB2K8xJqZJ9wKQx8Jz9vKqZEuJvB2K8') {
        return true;
      }
      return false;
    }),
    hash: sinon.stub().callsFake(async (password, saltRounds) => {
      return '$2b$10$K8eZXJ9.wKQx8Jz9vKqZEuJvB2K8xJqZJ9wKQx8Jz9vKqZEuJvB2K8';
    })
  };

  // Create mocked controllers
  const authController = proxyquire('../../src/controllers/authController', {
    '../models/userModel': userModelMock,
    'bcrypt': bcryptMock,
    'jsonwebtoken': jwt
  });

  const userController = proxyquire('../../src/controllers/userController', {
    '../models/userModel': userModelMock,
    'bcrypt': bcryptMock
  });

  const taskController = proxyquire('../../src/controllers/taskController', {
    '../models/taskModel': taskModelMock,
    '../models/userModel': userModelMock
  });

  // Create mocked routes
  const authRoutes = proxyquire('../../src/routes/authRoutes', {
    '../controllers/authController': authController
  });

  const userRoutes = proxyquire('../../src/routes/userRoutes', {
    '../controllers/userController': userController,
    '../middlewares/authMiddleware': require('../../src/middlewares/authMiddleware')
  });

  const taskRoutes = proxyquire('../../src/routes/taskRoutes', {
    '../controllers/taskController': taskController,
    '../middlewares/authMiddleware': require('../../src/middlewares/authMiddleware')
  });

  // Create mocked app
  const express = require('express');
  const app = express();
  const { requestLogger, errorLogger } = require('../../src/middlewares/loggerMiddleware');

  // Middleware setup
  app.use(requestLogger);
  app.use(express.json());

  // Error handling for malformed JSON
  app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      console.error(`[APP] JSON malformado na requisição ${req.method} ${req.path}:`, err.message);
      return res.status(400).json({ message: 'JSON inválido na requisição' });
    }
    next(err);
  });

  // Routes
  app.use('/auth', authRoutes);
  app.use('/users', userRoutes);
  app.use('/tasks', taskRoutes);

  // 404 handler
  app.use('*', (req, res) => {
    console.log(`[APP] Rota não encontrada: ${req.method} ${req.path}`);
    res.status(404).json({ message: 'Rota não encontrada' });
  });

  // Error logging
  app.use(errorLogger);

  // Global error handler
  app.use((err, req, res, next) => {
    console.error(`[APP] Erro não tratado na requisição ${req.method} ${req.path}:`, err);
    res.status(500).json({ 
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno'
    });
  });

  return app;
}

// Helper to create a valid JWT token for testing
function createValidTestToken(userId = 1, name = 'Test User') {
  return jwt.sign(
    { userId, name },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

module.exports = {
  mockPool,
  setupUserModelMocks,
  setupTaskModelMocks,
  createMockedApp,
  createValidTestToken
};
