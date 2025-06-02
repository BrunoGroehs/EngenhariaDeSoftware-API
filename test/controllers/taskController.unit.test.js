const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('TaskController Unit Tests', function() {
  let req, res, sandbox, taskController;
  let taskModelStub;

  beforeEach(function() {
    sandbox = sinon.createSandbox();
    req = {
      body: {},
      params: {},
      query: {}
    };
    res = {
      status: sandbox.stub().returnsThis(),
      json: sandbox.stub().returnsThis()
    };

    // Create stubs
    taskModelStub = {
      createTask: sandbox.stub(),
      findById: sandbox.stub(),
      findByUser: sandbox.stub(),
      updateTask: sandbox.stub(),
      deleteTask: sandbox.stub()
    };

    // Use proxyquire to inject stubs
    taskController = proxyquire('../../src/controllers/taskController', {
      '../models/taskModel': taskModelStub
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('create', function() {
    it('should create task successfully', async function() {
      const mockTask = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending',
        assignedTo: 1
      };

      req.body = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending',
        assignedTo: 1
      };

      taskModelStub.createTask.resolves(mockTask);

      await taskController.create(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(mockTask)).to.be.true;
      expect(taskModelStub.createTask.calledWith('Test Task', 'Test Description', 'pending', 1)).to.be.true;
    });

    it('should handle task creation error', async function() {
      req.body = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending',
        assignedTo: 1
      };

      taskModelStub.createTask.rejects(new Error('Database error'));

      await taskController.create(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({
        message: 'Erro ao criar tarefa',
        error: 'Database error'
      })).to.be.true;
    });
  });

  describe('get', function() {
    it('should get task successfully', async function() {
      const mockTask = { id: 1, title: 'Test Task' };
      req.params.id = '1';

      taskModelStub.findById.resolves(mockTask);

      await taskController.get(req, res);

      expect(res.json.calledWith(mockTask)).to.be.true;
      expect(taskModelStub.findById.calledWith('1')).to.be.true;
    });

    it('should return 404 when task not found', async function() {
      req.params.id = '999';

      taskModelStub.findById.resolves(null);

      await taskController.get(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Tarefa não encontrada' })).to.be.true;
    });
  });

  describe('listByUser', function() {
    it('should list tasks for user successfully', async function() {
      const mockTasks = [
        { id: 1, title: 'Task 1' },
        { id: 2, title: 'Task 2' }
      ];
      req.query.assignedTo = '1';

      taskModelStub.findByUser.resolves(mockTasks);

      await taskController.listByUser(req, res);

      expect(res.json.calledWith(mockTasks)).to.be.true;
      expect(taskModelStub.findByUser.calledWith('1')).to.be.true;
    });
  });

  describe('update', function() {
    it('should update task successfully', async function() {
      const mockTask = { id: 1, title: 'Updated Task' };
      req.params.id = '1';
      req.body = { title: 'Updated Task', description: 'Updated Description', status: 'completed' };

      taskModelStub.updateTask.resolves(mockTask);

      await taskController.update(req, res);

      expect(res.json.calledWith(mockTask)).to.be.true;
      expect(taskModelStub.updateTask.calledWith('1', 'Updated Task', 'Updated Description', 'completed')).to.be.true;
    });

    it('should return 404 when task to update not found', async function() {
      req.params.id = '999';
      req.body = { title: 'Updated Task' };

      taskModelStub.updateTask.resolves(null);

      await taskController.update(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Tarefa não encontrada' })).to.be.true;
    });
  });

  describe('remove', function() {
    it('should remove task successfully', async function() {
      req.params.id = '1';

      taskModelStub.deleteTask.resolves();

      await taskController.remove(req, res);

      expect(res.json.calledWith({ message: 'Tarefa removida com sucesso' })).to.be.true;
      expect(taskModelStub.deleteTask.calledWith('1')).to.be.true;
    });
  });
});
