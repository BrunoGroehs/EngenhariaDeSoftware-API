const chai = require('chai');
const sinon = require('sinon');

// Make expect globally available
global.expect = chai.expect;

// Set up test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_NAME = 'test_db';
process.env.DB_USER = 'test_user';
process.env.DB_PASSWORD = 'test_password';

// Global sinon sandbox for easier cleanup
global.sinon = sinon;