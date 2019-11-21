const request = require('supertest');
const moongose = require('mongoose');
const bcrypt = require('bcryptjs');

const app = require('../../../src/app');

const factory = require('../../factories');

const User = require('../../../src/app/schemas/userSchema');

describe('User', () => {
  beforeEach(async () => {
    await User.remove();
  });

  it('should be able create a user', async () => {
    const user = await factory.attrs('User');

    const response = await request(app)
      .post('/api/v1/users')
      .send(user);

    expect(response.body.status).toBe('success');
    expect(response.status).toBe(201);
  });

  it('should be able create user with encrypted password', async () => {
    const user = await factory.attrs('User');

    const response = await request(app)
      .post('/api/v1/users')
      .send(user);

    const compareHash = await bcrypt.compare(
      'test1234',
      response.body.data.user.password
    );

    expect(compareHash).toBe(true);
  });

  it('should be able users with duplicate email', async () => {
    const user = await factory.attrs('User');

    await request(app)
      .post('/api/v1/users')
      .send(user);

    const response = await request(app)
      .post('/api/v1/users')
      .send(user);

    expect(response.status).toBe(400);
    expect(response.body.message.name).toBe('MongoError');
  });

  it('should be able get all users', async () => {
    const userOne = await factory.attrs('User');
    const userTwo = await factory.attrs('User', {
      email: 'teste@email.com'
    });

    await request(app)
      .post('/api/v1/users')
      .send(userOne);

    await request(app)
      .post('/api/v1/users')
      .send(userTwo);

    const response = await request(app).get('/api/v1/users');

    expect(response.body.results).toBe(2);
  });

  it('should be able get one user', async () => {
    const user = await factory.create('User', {
      email: 'test@email.com'
    });

    const response = await request(app).get(`/api/v1/users/${user._id}`);

    expect(response.body.data.user.email).toBe('test@email.com');
  });

  it('should be able get user invalid id', async () => {
    const response = await request(app).get(
      `/api/v1/users/5c8a1d5b0190b214360d9999`
    );

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No document find with that ID!');
  });

  it('should be able update user', async () => {
    const user = await factory.create('User');

    const response = await request(app)
      .patch(`/api/v1/users/${user._id}`)
      .send({ email: 'test@email.com' });

    expect(response.body.status).toBe('success');
    expect(response.body.data.user.email).toBe('test@email.com');
  });

  it('should be able update user not exist', async () => {
    const response = await request(app)
      .patch(`/api/v1/users/5c8a1d5b0190b214360dc052`)
      .send({ email: 'test@email.com' });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No document find with that ID!');
  });

  it('should be able delete user', async () => {
    const user = await factory.create('User');

    const response = await request(app).delete(`/api/v1/users/${user._id}`);

    expect(response.status).toBe(204);
  });

  it('should be able delete user not exist', async () => {
    const response = await request(app).delete(
      `/api/v1/users/5c8a1d5b0190b214360dc052`
    );

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No document find with that ID!');
  });
});
