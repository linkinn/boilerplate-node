require('./bootstrap');

const express = require('express');

require('./database');

const routes = require('./routes');

const globalError = require('./utils/globalError');

class App {
  constructor() {
    this.server = express();

    this.middleware();
    this.routes();
    this.exception();
  }

  middleware() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }

  exception() {
    this.server.use(globalError);
  }
}

module.exports = new App().server;
