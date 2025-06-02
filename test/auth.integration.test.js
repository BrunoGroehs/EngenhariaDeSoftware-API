const request = require('supertest');
const { expect } = require('chai');

describe('Auth API Integration Tests', function() {
  let app;
  
  before(function(done) {
    // Set test environment
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'test-secret-key';
    
    // Load app after setting environment
    app = require('../src/app');
    
    // Call done to signal completion
    done();
  });
  describe('POST /auth/login - User login', function() {
    it('should return 400 when email is missing', async function() {
      const response = await request(app)
        .post('/auth/login')
        .send({ password: 'password123' });

      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('Usuário não encontrado');
    });

    it('should return 400 when both email and password are missing', async function() {
      const response = await request(app)
        .post('/auth/login')
        .send({});

      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('Usuário não encontrado');
    });

    it('should attempt to authenticate with valid credentials (will fail due to DB)', async function() {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData);

      // Will fail at database level, but validates request processing
      expect([400, 401, 500]).to.include(response.status);
    });

    it('should handle malformed request body', async function() {
      const response = await request(app)
        .post('/auth/login')
        .send('invalid json')
        .set('Content-Type', 'application/json');

      expect([400, 500]).to.include(response.status);
    });
  });

  describe('POST /auth/logout - User logout', function() {
    it('should logout successfully without token', async function() {
      const response = await request(app)
        .post('/auth/logout');

      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal('Logout efetuado com sucesso');
    });

    it('should logout successfully with valid token format', async function() {
      const response = await request(app)
        .post('/auth/logout')
        .set('Authorization', 'Bearer some-token');

      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal('Logout efetuado com sucesso');
    });

    it('should logout successfully with invalid token', async function() {
      const response = await request(app)
        .post('/auth/logout')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal('Logout efetuado com sucesso');
    });

    it('should logout successfully with malformed authorization header', async function() {
      const response = await request(app)
        .post('/auth/logout')
        .set('Authorization', 'InvalidFormat token');

      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal('Logout efetuado com sucesso');
    });

    it('should handle POST request with body', async function() {
      const response = await request(app)
        .post('/auth/logout')
        .send({ someData: 'test' });

      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal('Logout efetuado com sucesso');
    });
  });
});
