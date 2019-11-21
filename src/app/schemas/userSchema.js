const moongose = require('mongoose');

const userSchema = new moongose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please provide your email']
  },
  password: {
    type: String,
    required: [true, 'Please confirm your password']
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now()
  }
});

const User = moongose.model('User', userSchema);

module.exports = User;
