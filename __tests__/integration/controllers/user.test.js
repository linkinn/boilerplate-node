const request = require('supertest');
const moongose = require('mongoose');

const app = require('../../../src/app');

const User = require('../../../src/app/schemas/userSchema');

describe('User', () => {
  beforeAll(async () => {
    await User.remove();
  });

  it('create a user', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({
        name: 'Fillipi Nascimento',
        email: 'fillipi@hotmail.com',
        password: 'pass1234'
      });

    expect(response.body.status).toBe('success');
  });

  it('User exist email duplicated', async () => {
    await request(app)
      .post('/api/v1/users')
      .send({
        name: 'Fillipi Nascimento',
        email: 'fillipi@hotmail.com',
        password: 'pass1234'
      });

    const response = await request(app)
      .post('/api/v1/users')
      .send({
        name: 'Fillipi Nascimento',
        email: 'fillipi@hotmail.com',
        password: 'pass1234'
      });

    expect(response.status).toBe(400);
    expect(response.body.message.name).toBe('MongoError');
  });

  it('Get all users', async () => {
    await request(app)
      .post('/api/v1/users')
      .send({
        name: 'Fillipi Nascimento',
        email: 'fillipi@hotmail.com',
        password: 'pass1234'
      });

    await request(app)
      .post('/api/v1/users')
      .send({
        name: 'Jaime',
        email: 'jaime@hotmail.com',
        password: 'pass1234'
      });

    const response = await request(app).get('/api/v1/users');

    expect(response.body.results).toBe(2);
  });

  it('Get one user', async () => {
    await User.remove();
    const user = await User.create({
      _id: '5c8a1d5b0190b214360dc057',
      name: 'Fillipi Nascimento',
      email: 'fillipi@hotmail.com',
      password: 'pass1234'
    });

    const response = await request(app).get(`/api/v1/users/${user._id}`);

    expect(response.body.data.user.email).toBe('fillipi@hotmail.com');
  });

  it('Get user invalid id', async () => {
    await User.remove();
    await User.create({
      _id: '5c8a1d5b0190b214360dc057',
      name: 'Fillipi Nascimento',
      email: 'fillipi@hotmail.com',
      password: 'pass1234'
    });

    const response = await request(app).get(
      `/api/v1/users/5c8a1d5b0190b214360dc052`
    );

    expect(response.status).toBe(400);
    // expect(response.body.message).toBe('User not exist!');
  });

  afterAll(() => {
    moongose.connection.close();
  });
});
