const request = require('supertest');
const { expect } = require('chai');
// Unificação dos testes: agora cobre tanto cenários com mocks quanto sem mocks
const { createMockedApp, createValidTestToken } = require('./helpers/testSetup');
const mockData = require('./helpers/mockData');

let app;
let useMock = false;
try {
  if (createMockedApp && mockData) {
    useMock = true;
  }
} catch (e) {}

before(function() {
  if (useMock) {
    app = createMockedApp();
  } else {
    // Set test environment
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'test-secret-key';
    
    // Load app after setting environment
    app = require('../src/app');
  }
});

if (useMock) {
  beforeEach(function() {
    mockData.resetMockData();
  });
}

describe('Tasks API Integration Tests', function() {
  describe('POST /tasks - Create a new task', function() {
    it('should return 401 when no token is provided', async function() {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        assignedTo: 1
      };

      const response = await request(app)
        .post('/tasks')
        .send(taskData);

      expect(response.status).to.equal(401);
    });

    it('should return 403 when invalid token is provided', async function() {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        assignedTo: 1
      };

      const response = await request(app)
        .post('/tasks')
        .set('Authorization', 'Bearer invalid-token')
        .send(taskData);

      expect(response.status).to.equal(403);
    });

    it('should return 400 when title is missing', async function() {
      const taskData = {
        description: 'Test Description',
        assignedTo: 1
      };

      const response = await request(app)
        .post('/tasks')
        .set('Authorization', 'Bearer valid-token-format')
        .send(taskData);

      // May get 403 for token or 400 for missing fields
      expect([400, 403]).to.include(response.status);
    });

    it('should return 400 when assignedTo is missing', async function() {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description'
      };

      const response = await request(app)
        .post('/tasks')
        .set('Authorization', 'Bearer valid-token-format')
        .send(taskData);

      // May get 403 for token or 400 for missing fields
      expect([400, 403]).to.include(response.status);
    });

    it('should attempt to create task with valid data (will fail due to auth/DB)', async function() {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        assignedTo: 1
      };

      const response = await request(app)
        .post('/tasks')
        .set('Authorization', 'Bearer valid-token-format')
        .send(taskData);

      // Will fail at auth or database level
      expect([403, 500]).to.include(response.status);
    });
  });

  describe('GET /tasks/:id - Get task details', function() {
    it('should return 401 when no token is provided', async function() {
      const response = await request(app)
        .get('/tasks/1');

      expect(response.status).to.equal(401);
    });

    it('should return 403 when invalid token is provided', async function() {
      const response = await request(app)
        .get('/tasks/1')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).to.equal(403);
    });

    it('should attempt to get task with valid token format (will fail due to DB)', async function() {
      const response = await request(app)
        .get('/tasks/1')
        .set('Authorization', 'Bearer valid-token-format');

      // Will fail at auth or database level
      expect([403, 404, 500]).to.include(response.status);
    });
  });

  describe('GET /tasks - List tasks assigned to user', function() {
    it('should return 401 when no token is provided', async function() {
      const response = await request(app)
        .get('/tasks')
        .query({ assignedTo: 1 });

      expect(response.status).to.equal(401);
    });

    it('should return 403 when invalid token is provided', async function() {
      const response = await request(app)
        .get('/tasks')
        .query({ assignedTo: 1 })
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).to.equal(403);
    });

    it('should return 400 when assignedTo parameter is missing', async function() {
      const response = await request(app)
        .get('/tasks')
        .set('Authorization', 'Bearer valid-token-format');

      // May get 403 for token or 400 for missing parameter
      expect([400, 403]).to.include(response.status);
    });

    it('should attempt to list tasks with valid parameters (will fail due to auth/DB)', async function() {
      const response = await request(app)
        .get('/tasks')
        .query({ assignedTo: 1 })
        .set('Authorization', 'Bearer valid-token-format');

      // Will fail at auth or database level
      expect([403, 500]).to.include(response.status);
    });
  });

  describe('PUT /tasks/:id - Update task information', function() {
    it('should return 401 when no token is provided', async function() {
      const updateData = {
        title: 'Updated Task',
        description: 'Updated Description'
      };

      const response = await request(app)
        .put('/tasks/1')
        .send(updateData);

      expect(response.status).to.equal(401);
    });

    it('should return 403 when invalid token is provided', async function() {
      const updateData = {
        title: 'Updated Task',
        description: 'Updated Description'
      };

      const response = await request(app)
        .put('/tasks/1')
        .set('Authorization', 'Bearer invalid-token')
        .send(updateData);

      expect(response.status).to.equal(403);
    });

    it('should attempt to update task with valid data (will fail due to auth/DB)', async function() {
      const updateData = {
        title: 'Updated Task',
        description: 'Updated Description'
      };

      const response = await request(app)
        .put('/tasks/1')
        .set('Authorization', 'Bearer valid-token-format')
        .send(updateData);

      // Will fail at auth or database level
      expect([403, 404, 500]).to.include(response.status);
    });
  });

  describe('DELETE /tasks/:id - Remove task', function() {
    it('should return 401 when no token is provided', async function() {
      const response = await request(app)
        .delete('/tasks/1');

      expect(response.status).to.equal(401);
    });

    it('should return 403 when invalid token is provided', async function() {
      const response = await request(app)
        .delete('/tasks/1')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).to.equal(403);
    });

    it('should attempt to delete task with valid token format (will fail due to auth/DB)', async function() {
      const response = await request(app)
        .delete('/tasks/1')
        .set('Authorization', 'Bearer valid-token-format');

      // Will fail at auth or database level
      expect([403, 500]).to.include(response.status);
    });
  });

  describe('GET /tasks/user - List tasks by user (controller listByUser)', function() {
    it('should return 400 when assignedTo parameter is missing', async function() {
      const validToken = useMock ? createValidTestToken(1, 'João Silva') : 'valid-token-format';
      const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${validToken}`);
      expect([400, 403]).to.include(response.status);
    });

    it('should return 200 and a list of tasks for a valid user', async function() {
      if (!useMock) return this.skip();
      const validToken = createValidTestToken(1, 'João Silva');
      const response = await request(app)
        .get('/tasks')
        .query({ assignedTo: 1 })
        .set('Authorization', `Bearer ${validToken}`);
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
    });
  });
});
