const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../src/models/User');

process.env.NODE_ENV = 'test';

let authToken;
let testUserId;

beforeAll(async () => {
  const testDbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/rest-api-test';
  await mongoose.connect(testDbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User API Tests', () => {
  // test POST /users
  describe('POST /users', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/users')
        .send({
          name: 'Arbi Ihsan',
          email: 'arbi@example.com',
          password: 'inipassword'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.name).toBe('Arbi Ihsan');
      expect(res.body.data.email).toBe('arbi@example.com');
      expect(res.body.data).not.toHaveProperty('password');
      
      testUserId = res.body.data._id;
    });

    it('should fail with invalid email', async () => {
      const res = await request(app)
        .post('/users')
        .send({
          name: 'Arbi Ihsan',
          email: 'email-salah',
          password: 'inipassword'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should fail with short password', async () => {
      const res = await request(app)
        .post('/users')
        .send({
          name: 'Arbi Ihsan',
          email: 'arbi@example.com',
          password: '12345'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should fail with duplicate email', async () => {
      await request(app)
        .post('/users')
        .send({
          name: 'Arbi Ihsan',
          email: 'arbi@example.com',
          password: 'inipassword'
        });

      const res = await request(app)
        .post('/users')
        .send({
          name: 'Arbi Ihsan',
          email: 'arbi@example.com',
          password: 'password456'
        });

      expect(res.statusCode).toBe(409);
      expect(res.body.success).toBe(false);
    });
  });

  // test POST /login
  describe('POST /login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/users')
        .send({
          name: 'Arbi Ihsan',
          email: 'arbi@example.com',
          password: 'inipassword'
        });
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/login')
        .send({
          email: 'arbi@example.com',
          password: 'inipassword'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe('arbi@example.com');
      
      authToken = res.body.token;
    });

    it('should fail with invalid email', async () => {
      const res = await request(app)
        .post('/login')
        .send({
          email: 'salah@example.com',
          password: 'inipassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should fail with invalid password', async () => {
      const res = await request(app)
        .post('/login')
        .send({
          email: 'arbi@example.com',
          password: 'salahpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  // test GET /users 
  describe('GET /users', () => {
    beforeEach(async () => {
      await request(app)
        .post('/users')
        .send({
          name: 'Arbi Ihsan',
          email: 'arbi@example.com',
          password: 'inipassword'
        });

      const loginRes = await request(app)
        .post('/login')
        .send({
          email: 'arbi@example.com',
          password: 'inipassword'
        });

      authToken = loginRes.body.token;
    });

    it('should get all users with valid token', async () => {
      const res = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.count).toBeGreaterThan(0);
    });

    it('should fail without token', async () => {
      const res = await request(app)
        .get('/users');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should fail with invalid token', async () => {
      const res = await request(app)
        .get('/users')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  // test GET /users/:id
  describe('GET /users/:id', () => {
    beforeEach(async () => {
      const createRes = await request(app)
        .post('/users')
        .send({
          name: 'Arbi Ihsan',
          email: 'arbi@example.com',
          password: 'inipassword'
        });

      testUserId = createRes.body.data._id;

      const loginRes = await request(app)
        .post('/login')
        .send({
          email: 'arbi@example.com',
          password: 'inipassword'
        });

      authToken = loginRes.body.token;
    });

    it('should get user by id with valid token', async () => {
      const res = await request(app)
        .get(`/users/${testUserId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(testUserId);
    });

    it('should fail without token', async () => {
      const res = await request(app)
        .get(`/users/${testUserId}`);

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return 404 for non exist user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/users/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // test PUT /users/:id
  describe('PUT /users/:id', () => {
    beforeEach(async () => {
      const createRes = await request(app)
        .post('/users')
        .send({
          name: 'Arbi Ihsan',
          email: 'arbi@example.com',
          password: 'inipassword'
        });

      testUserId = createRes.body.data._id;
    });

    it('should update user name', async () => {
      const res = await request(app)
        .put(`/users/${testUserId}`)
        .send({
          name: 'Arbi M Ihsan'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Arbi M Ihsan');
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/users/${fakeId}`)
        .send({
          name: 'Arbi M Ihsan'
        });

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // test DELETE /users/:id
  describe('DELETE /users/:id', () => {
    beforeEach(async () => {
      const createRes = await request(app)
        .post('/users')
        .send({
          name: 'Arbi Ihsan',
          email: 'arbi@example.com',
          password: 'inipassword'
        });

      testUserId = createRes.body.data._id;
    });

    it('should delete user', async () => {
      const res = await request(app)
        .delete(`/users/${testUserId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/users/${fakeId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
