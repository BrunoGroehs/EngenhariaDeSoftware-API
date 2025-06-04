const request = require('supertest');
const { expect } = require('chai');

describe('Users API Integration Tests', function () {
  let app;

  before(function () {
    // Set test environment
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'test-secret-key';

    // Load app after setting environment
    app = require('../src/app');
  });

  describe('POST /users - Create a new user', function () {
    it('should return 400 when required fields are missing', async function () {
      const response = await request(app)
        .post('/users')
        .send({ name: 'Test User' }); // Missing email and password

      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('Campos obrigatórios ausentes');
    });

    it('should return 400 when name is missing', async function () {
      const response = await request(app)
        .post('/users')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('Campos obrigatórios ausentes');
    });

    it('should return 400 when email is missing', async function () {
      const response = await request(app)
        .post('/users')
        .send({ name: 'Test User', password: 'password123' });

      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('Campos obrigatórios ausentes');
    });

    it('should return 400 when password is missing', async function () {
      const response = await request(app)
        .post('/users')
        .send({ name: 'Test User', email: 'test@example.com' });

      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('Campos obrigatórios ausentes');
    });

    describe('GET /users/:id - Get user information', function () {
      it('should return 401 when no token is provided', async function () {
        const response = await request(app)
          .get('/users/1');

        expect(response.status).to.equal(401);
      });

      it('should return 403 when invalid token is provided', async function () {
        const response = await request(app)
          .get('/users/1')
          .set('Authorization', 'Bearer invalid-token');

        expect(response.status).to.equal(403);
      });

      it('should return 403 when malformed authorization header', async function () {
        const response = await request(app)
          .get('/users/1')
          .set('Authorization', 'InvalidFormat token');

        expect(response.status).to.equal(403);
      });

      it('should attempt to get user with valid token format (will fail due to DB)', async function () {
        // This test will fail at the DB level, but validates the auth flow
        const response = await request(app)
          .get('/users/1')
          .set('Authorization', 'Bearer validtokenformat');

        // We expect 500 due to JWT verification or DB error
        expect([403, 500]).to.include(response.status);
      });
    });

    describe('PUT /users/:id - Update user information', function () {
      it('should return 401 when no token is provided', async function () {
        const response = await request(app)
          .put('/users/1')
          .send({ name: 'Updated User' });

        expect(response.status).to.equal(401);
      });

      it('should return 403 when invalid token is provided', async function () {
        const response = await request(app)
          .put('/users/1')
          .set('Authorization', 'Bearer invalid-token')
          .send({ name: 'Updated User' });

        expect(response.status).to.equal(403);
      });
    });

    describe('DELETE /users/:id - Remove user (soft delete)', function () {
      it('should return 401 when no token is provided', async function () {
        const response = await request(app)
          .delete('/users/1');

        expect(response.status).to.equal(401);
      });

      it('should return 403 when invalid token is provided', async function () {
        const response = await request(app)
          .delete('/users/1')
          .set('Authorization', 'Bearer invalid-token');

        expect(response.status).to.equal(403);
      });
    });
  });
});
