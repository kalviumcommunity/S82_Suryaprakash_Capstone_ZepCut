import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

let token;
let userId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

describe('User API (with Auth)', () => {
  it('should register a new user', async () => {
    const res = await request(app).post('/api/users/register').send({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'test123',
      role: 'customer',
      phone: '1234567890',
      address: '123 Test Street',
      location: {
        type: 'Point',
        coordinates: [77.5946, 12.9716], // Longitude, Latitude
      },
    });

    console.log('Register response:', res.body);
    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe('testuser@example.com');
    userId = res.body._id;
  });

  it('should login and return a token', async () => {
    const res = await request(app).post('/api/users/login').send({
      email: 'testuser@example.com',
      password: 'test123',
    });

    console.log('Login response:', res.body);
    console.log("Login status:", res.statusCode);

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();

    token = res.body.token;
    userId = res.body._id || userId; // Fallback
  });

  it('should get all users (protected)', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  it('should get user by ID (protected)', async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  it('should update user (protected)', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Test User' });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated Test User');
  });

  it('should delete user (protected)', async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  it('should return 404 after deletion', async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });
});
