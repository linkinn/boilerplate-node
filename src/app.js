const express = require('express');

require('./database');

class App {
  constructor() {
    this.server = express();
    this.middleware();
    this.routes();
  }

  middleware() {
    this.server.use(express.json());
  }

  routes() {}
}

module.exports = new App().server;
