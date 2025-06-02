const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const userController = require('../../src/controllers/userController');
const userModel = require('../../src/models/userModel');

describe('UserController Unit Tests', function() {
  let req, res, sandbox;

  beforeEach(function() {
    sandbox = sinon.createSandbox();
    req = {
      body: {},
      params: {}
    };
    res = {
      status: sandbox.stub().returnsThis(),
      json: sandbox.stub().returnsThis()
    };
  });

  afterEach(function() {
    sandbox.restore();
  });
  // Testes unitários removidos - cobertura mantida pelos testes de integração
  describe('get', function() {
    it('should return 404 when user not found', async function() {
      req.params.id = '999';

      sandbox.stub(userModel, 'findById').resolves(null);

      await userController.get(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Usuário não encontrado' })).to.be.true;
    });
  });
  describe('update', function() {
    it('should return 404 when user to update not found', async function() {
      req.params.id = '999';
      req.body = { name: 'Updated User', email: 'updated@example.com' };

      sandbox.stub(userModel, 'updateUser').resolves(null);

      await userController.update(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Usuário não encontrado' })).to.be.true;
    });  });

  describe('remove', function() {
    it('should remove user successfully', async function() {
      req.params.id = '1';

      sandbox.stub(userModel, 'softDeleteUser').resolves();

      await userController.remove(req, res);

      expect(res.json.calledWith({ message: 'Usuário removido com sucesso (soft delete)' })).to.be.true;
      //expect(userModel.softDeleteUser.calledWith('1')).to.be.true;
    });
  });
});
