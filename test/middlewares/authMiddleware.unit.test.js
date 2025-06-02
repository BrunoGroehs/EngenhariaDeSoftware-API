const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../../src/middlewares/authMiddleware');

describe('AuthMiddleware Unit Tests', function() {
  let req, res, next, sandbox;

  beforeEach(function() {
    sandbox = sinon.createSandbox();
    req = {
      headers: {}
    };
    res = {
      status: sandbox.stub().returnsThis(),
      json: sandbox.stub().returnsThis()
    };
    next = sandbox.stub();
    
    // Mock JWT_SECRET for tests
    process.env.JWT_SECRET = 'test-secret-key';
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('authenticateToken', function() {
    it('should authenticate valid token successfully', function() {
      const mockUser = { userId: 1, name: 'Test User' };
      req.headers['authorization'] = 'Bearer valid-token';

      sandbox.stub(jwt, 'verify').callsArgWith(2, null, mockUser);

      authenticateToken(req, res, next);

      expect(req.user).to.deep.equal(mockUser);
      expect(next.calledOnce).to.be.true;
      expect(jwt.verify.calledWith('valid-token', 'test-secret-key')).to.be.true;
    });

    it('should return 401 when no authorization header is provided', function() {
      authenticateToken(req, res, next);

      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledWith({ message: 'Token ausente' })).to.be.true;
      expect(next.called).to.be.false;
    });

    it('should return 401 when no token is provided in authorization header', function() {
      req.headers['authorization'] = 'Bearer';

      authenticateToken(req, res, next);

      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledWith({ message: 'Token ausente' })).to.be.true;
      expect(next.called).to.be.false;
    });

    it('should return 403 when token is invalid', function() {
      req.headers['authorization'] = 'Bearer invalid-token';

      sandbox.stub(jwt, 'verify').callsArgWith(2, new Error('Invalid token'));

      authenticateToken(req, res, next);

      expect(res.status.calledWith(403)).to.be.true;
      expect(res.json.calledWith({ message: 'Token inválido' })).to.be.true;
      expect(next.called).to.be.false;
    });
  });
});
