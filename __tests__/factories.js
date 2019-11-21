/* eslint-disable */
const faker = require('faker');
const { factory } = require('factory-girl');

const User = require('../src/app/schemas/userSchema');

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: 'test1234',
  passwordConfirm: 'test1234'
});

module.exports = factory;
