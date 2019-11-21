// const Sequelize = require('sequelize');
const mongoose = require('mongoose');

// const databaseConfig = require('../config/database');

// const models = [];

class Database {
  constructor() {
    // this.init();
    this.mongo();
  }

  // init() {
  //   this.connection = new Sequelize(databaseConfig);

  //   models.map(model => model.init(this.connection));
  // }

  mongo() {
    this.mongoConnection = mongoose
      .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      })
      .then(() => console.log('DB connection successful'));
  }
}

module.exports = new Database();
