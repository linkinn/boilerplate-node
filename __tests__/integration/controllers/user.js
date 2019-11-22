const request = require('supertest');
const bcrypt = require('bcryptjs');

const app = require('../../../src/app');

const factory = require('../../factories');

const User = require('../../../src/app/schemas/userSchema');

describe('User', () => {
  beforeEach(async () => {
    await User.remove();
    await factory.create('User', {
      email: 'admin@email.com'
    });
  });

  it('should create a user', async () => {
    const currentUser = await User.findOne({ email: 'admin@email.com' });
    const token = currentUser.generateToken(currentUser._id);

    const user = await factory.attrs('User');

    const response = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${token}`)
      .send(user);

    expect(response.body.status).toBe('success');
    expect(response.status).toBe(201);
  });

  it('should create user with encrypted password', async () => {
    const currentUser = await User.findOne({ email: 'admin@email.com' });
    const token = currentUser.generateToken(currentUser._id);

    const user = await factory.attrs('User');

    const response = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${token}`)
      .send(user);

    const compareHash = await bcrypt.compare(
      'test1234',
      response.body.data.doc.password
    );

    expect(compareHash).toBe(true);
  });

  it('should users with duplicate email', async () => {
    const currentUser = await User.findOne({ email: 'admin@email.com' });
    const token = currentUser.generateToken(currentUser._id);

    const user = await factory.attrs('User');

    await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${token}`)
      .send(user);

    const response = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${token}`)
      .send(user);

    expect(response.status).toBe(400);
  });

  it('should get all users', async () => {
    const currentUser = await User.findOne({ email: 'admin@email.com' });
    const token = currentUser.generateToken(currentUser._id);

    const userOne = await factory.attrs('User');
    const userTwo = await factory.attrs('User', {
      email: 'teste@email.com'
    });

    await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${token}`)
      .send(userOne);

    await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${token}`)
      .send(userTwo);

    const response = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${token}`);

    expect(response.body.results).toBe(3);
  });

  it('should get one user', async () => {
    const currentUser = await User.findOne({ email: 'admin@email.com' });
    const token = currentUser.generateToken(currentUser._id);

    const user = await factory.create('User', {
      email: 'test@email.com'
    });

    const response = await request(app)
      .get(`/api/v1/users/${user._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body.data.doc.email).toBe('test@email.com');
  });

  it('should get user invalid id', async () => {
    const currentUser = await User.findOne({ email: 'admin@email.com' });
    const token = currentUser.generateToken(currentUser._id);

    const response = await request(app)
      .get(`/api/v1/users/5c8a1d5b0190b214360d9999`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No document find with that ID!');
  });

  it('should update user', async () => {
    const currentUser = await User.findOne({ email: 'admin@email.com' });
    const token = currentUser.generateToken(currentUser._id);

    const user = await factory.create('User');

    const response = await request(app)
      .patch(`/api/v1/users/${user._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'test@email.com' });

    expect(response.body.status).toBe('success');
    expect(response.body.data.doc.email).toBe('test@email.com');
  });

  it('should not update user that does not exist', async () => {
    const currentUser = await User.findOne({ email: 'admin@email.com' });
    const token = currentUser.generateToken(currentUser._id);

    const response = await request(app)
      .patch(`/api/v1/users/5c8a1d5b0190b214360dc052`)
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'test@email.com' });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No document find with that ID!');
  });

  it('should delete user', async () => {
    const currentUser = await User.findOne({ email: 'admin@email.com' });
    const token = currentUser.generateToken(currentUser._id);

    const user = await factory.create('User');

    const response = await request(app)
      .delete(`/api/v1/users/${user._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  it('should not delete user that does not exist', async () => {
    const currentUser = await User.findOne({ email: 'admin@email.com' });
    const token = currentUser.generateToken(currentUser._id);

    const response = await request(app)
      .delete(`/api/v1/users/5c8a1d5b0190b214360dc052`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No document find with that ID!');
  });
});
