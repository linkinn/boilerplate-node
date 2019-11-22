const User = require('../schemas/userSchema');

const FactoryController = require('./FactoryController');

exports.index = FactoryController.index(User);

exports.show = FactoryController.show(User);

exports.store = FactoryController.store(User);

exports.update = FactoryController.update(User);

exports.delete = FactoryController.delete(User);
