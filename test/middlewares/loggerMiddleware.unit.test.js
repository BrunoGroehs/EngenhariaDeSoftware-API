const { expect } = require('chai');
const sinon = require('sinon');
const { requestLogger } = require('../../src/middlewares/loggerMiddleware');

describe('LoggerMiddleware Unit Tests', function() {
  let req, res, next, sandbox;

  beforeEach(function() {
    sandbox = sinon.createSandbox();
    req = {
      method: 'POST',
      path: '/test',
      body: { name: 'test', password: 'secret123' },
      query: { page: 1 }
    };
    res = {
      send: sandbox.stub(),
      statusCode: 200
    };
    next = sandbox.stub();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('requestLogger', function() {
    it('should log request with body and query parameters', function() {
      // Mock console.log to capture logs
      const consoleSpy = sandbox.spy(console, 'log');
      
      requestLogger(req, res, next);
      
      // Verify next was called
      expect(next.calledOnce).to.be.true;
      
      // Verify logs were called
      expect(consoleSpy.called).to.be.true;
    });
  });
});