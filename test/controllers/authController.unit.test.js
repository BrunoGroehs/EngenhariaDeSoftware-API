const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('AuthController Unit Tests', function() {
  let req, res, sandbox, authController;
  let userModelStub, bcryptStub, jwtStub;

  beforeEach(function() {
    sandbox = sinon.createSandbox();
    req = {
      body: {}
    };
    res = {
      status: sandbox.stub().returnsThis(),
      json: sandbox.stub().returnsThis()
    };
    
    // Mock JWT_SECRET for tests
    process.env.JWT_SECRET = 'test-secret-key';

    // Create stubs
    userModelStub = {
      findByEmail: sandbox.stub()
    };
    bcryptStub = {
      compare: sandbox.stub()
    };
    jwtStub = {
      sign: sandbox.stub()
    };

    // Use proxyquire to inject stubs
    authController = proxyquire('../../src/controllers/authController', {
      '../models/userModel': userModelStub,
      'bcrypt': bcryptStub,
      'jsonwebtoken': jwtStub
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('login', function() {
    it('should successfully login with valid credentials', async function() {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password_hash: 'hashed_password'
      };

      req.body = { email: 'test@example.com', password: 'password123' };

      userModelStub.findByEmail.resolves(mockUser);
      bcryptStub.compare.resolves(true);
      jwtStub.sign.returns('fake-jwt-token');

      await authController.login(req, res);

      expect(res.json.calledWith({ token: 'fake-jwt-token' })).to.be.true;
      expect(userModelStub.findByEmail.calledWith('test@example.com')).to.be.true;
      expect(bcryptStub.compare.calledWith('password123', 'hashed_password')).to.be.true;
    });

    it('should return 401 for invalid password', async function() {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password_hash: 'hashed_password'
      };

      req.body = { email: 'test@example.com', password: 'wrongpassword' };

      userModelStub.findByEmail.resolves(mockUser);
      bcryptStub.compare.resolves(false);

      await authController.login(req, res);

      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledWith({ message: 'Senha incorreta' })).to.be.true;
    });
  });

  describe('logout', function() {
    it('should logout successfully', function() {
      authController.logout(req, res);

      expect(res.json.calledWith({ message: 'Logout efetuado com sucesso' })).to.be.true;
    });
  });
});
