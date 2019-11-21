const request = require('supertest');
const moongose = require('mongoose');

const app = require('../../../src/app');

const factory = require('../../factories');

const User = require('../../../src/app/schemas/userSchema');

const FactoryController = require('../../../src/app/controllers/FactoryController');

describe('Factory', () => {
  beforeEach(async () => {
    await User.remove();
  });

  it('should be able get a doc', async () => {
    const user = await factory.create('User');

    app.get('/factories/:id', new FactoryController(User).show);
    const response = await request(app).get(`/factories/${user._id}`);

    expect(response.status).toBe(200);
    expect(response.body.data.doc.email).toBe(user.email);
  });

  it('should be able get error invalid id', async () => {
    app.get('/factories/:id', new FactoryController(User).show);
    const response = await request(app).get(
      `/factories/5c8a1d5b0190b214360d9999`
    );

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No document find with that ID!');
  });

  it('should be able get all docs', async () => {
    await factory.create('User', {
      email: 'teste1@email.com'
    });
    await factory.create('User');

    app.get('/factories', new FactoryController(User).index);

    const response = await request(app).get('/factories');

    expect(response.status).toBe(200);
    expect(response.body.results).toBe(2);
  });

  it('should be able create a doc', async () => {
    const user = await factory.attrs('User');

    app.post('/factories', new FactoryController(User).store);

    const response = await request(app)
      .post('/factories')
      .send(user);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('success');
  });

  it('should be able update a doc', async () => {
    const user = await factory.create('User');

    app.patch('/factories/:id', new FactoryController(User).update);

    const response = await request(app)
      .patch(`/factories/${user._id}`)
      .send({ email: 'teste@email.com' });

    expect(response.status).toBe(200);
    expect(response.body.data.doc.email).toBe('teste@email.com');
  });

  it('should be able update error invalid id', async () => {
    app.patch('/factories/:id', new FactoryController(User).update);

    const response = await request(app)
      .patch(`/factories/5c8a1d5b0190b214360d9999`)
      .send({ email: 'teste@email.com' });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No document find with that ID!');
  });

  it('should be able delete a doc', async () => {
    const user = await factory.create('User');

    app.delete('/factories/:id', new FactoryController(User).delete);

    const response = await request(app).delete(`/factories/${user._id}`);

    expect(response.status).toBe(204);
  });

  it('should be able delete error invalid id', async () => {
    app.delete('/factories/:id', new FactoryController(User).delete);

    const response = await request(app).delete(
      `/factories/5c8a1d5b0190b214360d9999`
    );

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No document find with that ID!');
  });

  afterAll(() => {
    moongose.connection.close();
  });
});
