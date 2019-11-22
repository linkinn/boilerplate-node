const moongose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
  photo: {
    type: String
  },
  roles: {
    type: String,
    enum: ['adim', 'manager', 'user'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please confirm your password'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE or SAVE!!!
      validator: function(val) {
        return val === this.password;
      },
      message: 'Password are not the same!'
    }
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now()
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.generateToken = function(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const User = moongose.model('User', userSchema);

module.exports = User;
