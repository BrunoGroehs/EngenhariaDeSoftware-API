const request = require('supertest');
const { expect } = require('chai');
const { createMockedApp, createValidTestToken } = require('./helpers/testSetup');
const mockData = require('./helpers/mockData');

describe('Tasks API Integration Tests', function() {
  let app;
  
  before(function() {
    // Create mocked app with isolated data
    app = createMockedApp();
  });

  beforeEach(function() {
    // Reset mock data before each test
    mockData.resetMockData();
  });

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
      const validToken = createValidTestToken(1, 'João Silva');
      const taskData = {
        description: 'Test Description',
        assignedTo: 1
      };

      const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${validToken}`)
        .send(taskData);

      expect(response.status).to.equal(400);
    });

    it('should return 400 when assignedTo is missing', async function() {
      const validToken = createValidTestToken(1, 'João Silva');
      const taskData = {
        title: 'Test Task',
        description: 'Test Description'
      };

      const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${validToken}`)
        .send(taskData);

      expect(response.status).to.equal(400);
    });

    it('should successfully create task with valid data', async function() {
      const validToken = createValidTestToken(1, 'João Silva');
      const taskData = {
        title: 'New Test Task',
        description: 'Task created in test',
        assignedTo: 2
      };

      const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${validToken}`)
        .send(taskData);

      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal('Tarefa criada com sucesso');
      expect(response.body.task).to.have.property('id');
      expect(response.body.task.title).to.equal('New Test Task');
      expect(response.body.task.assignedTo).to.equal(2);
    });

    it('should return 400 when assignedTo user does not exist', async function() {
      const validToken = createValidTestToken(1, 'João Silva');
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        assignedTo: 999 // Non-existent user
      };

      const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${validToken}`)
        .send(taskData);

      expect([400, 404]).to.include(response.status);
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

    it('should successfully get task with valid token', async function() {
      const validToken = createValidTestToken(1, 'João Silva');

      const response = await request(app)
        .get('/tasks/1')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.task).to.have.property('id', 1);
      expect(response.body.task).to.have.property('title', 'Implementar autenticação');
      expect(response.body.task).to.have.property('assignedTo', 1);
    });

    it('should return 404 when task does not exist', async function() {
      const validToken = createValidTestToken(1, 'João Silva');

      const response = await request(app)
        .get('/tasks/999')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal('Tarefa não encontrada');
    });

    it('should return 400 when invalid task ID format', async function() {
      const validToken = createValidTestToken(1, 'João Silva');

      const response = await request(app)
        .get('/tasks/invalid-id')
        .set('Authorization', `Bearer ${validToken}`);

      expect([400, 404]).to.include(response.status);
    });
  });

  describe('GET /tasks - List tasks', function() {
    it('should return 401 when no token is provided', async function() {
      const response = await request(app)
        .get('/tasks');

      expect(response.status).to.equal(401);
    });

    it('should return 403 when invalid token is provided', async function() {
      const response = await request(app)
        .get('/tasks')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).to.equal(403);
    });

    it('should successfully list all tasks with valid token', async function() {
      const validToken = createValidTestToken(1, 'João Silva');

      const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.tasks).to.be.an('array');
      expect(response.body.tasks).to.have.length.greaterThan(0);
    });

    it('should filter tasks by assignedTo user', async function() {
      const validToken = createValidTestToken(1, 'João Silva');

      const response = await request(app)
        .get('/tasks')
        .query({ assignedTo: 1 })
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.tasks).to.be.an('array');
      // Should only return tasks assigned to user 1
      response.body.tasks.forEach(task => {
        expect(task.assignedTo).to.equal(1);
      });
    });
  });

  describe('PUT /tasks/:id - Update task', function() {
    it('should return 401 when no token is provided', async function() {
      const updateData = {
        title: 'Updated Task',
        status: 'em_progresso'
      };

      const response = await request(app)
        .put('/tasks/1')
        .send(updateData);

      expect(response.status).to.equal(401);
    });

    it('should return 403 when invalid token is provided', async function() {
      const updateData = {
        title: 'Updated Task',
        status: 'em_progresso'
      };

      const response = await request(app)
        .put('/tasks/1')
        .set('Authorization', 'Bearer invalid-token')
        .send(updateData);

      expect(response.status).to.equal(403);
    });

    it('should successfully update task with valid token and data', async function() {
      const validToken = createValidTestToken(1, 'João Silva');
      const updateData = {
        title: 'Updated Task Title',
        status: 'em_progresso'
      };

      const response = await request(app)
        .put('/tasks/1')
        .set('Authorization', `Bearer ${validToken}`)
        .send(updateData);

      expect([200, 204]).to.include(response.status);
    });

    it('should return 404 when trying to update non-existent task', async function() {
      const validToken = createValidTestToken(1, 'João Silva');
      const updateData = {
        title: 'Updated Task',
        status: 'concluido'
      };

      const response = await request(app)
        .put('/tasks/999')
        .set('Authorization', `Bearer ${validToken}`)
        .send(updateData);

      expect(response.status).to.equal(404);
    });
  });

  describe('DELETE /tasks/:id - Delete task', function() {
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

    it('should successfully delete task with valid token', async function() {
      const validToken = createValidTestToken(1, 'João Silva');

      const response = await request(app)
        .delete('/tasks/1')
        .set('Authorization', `Bearer ${validToken}`);

      expect([200, 204]).to.include(response.status);
    });

    it('should return 404 when trying to delete non-existent task', async function() {
      const validToken = createValidTestToken(1, 'João Silva');

      const response = await request(app)
        .delete('/tasks/999')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).to.equal(404);
    });
  });
});
