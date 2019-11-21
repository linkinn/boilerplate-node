const User = require('../schemas/userSchema');

class UserController {
  async index(req, res) {
    const user = await User.find();

    return res
      .status(200)
      .json({ status: 'success', results: user.length, data: { user } });
  }

  async show(req, res, next) {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        throw Error('No document find with that ID!');
      }

      return res.status(200).json({ status: 'success', data: { user } });
    } catch (error) {
      return res.status(404).json({ status: 'error', message: error.message });
    }
  }

  async store(req, res) {
    try {
      const user = await User.create(req.body);

      return res.status(201).json({ status: 'success', data: { user } });
    } catch (error) {
      return res.status(400).json({ status: 'error', message: error });
    }
  }

  async update(req, res) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });

      if (!user) {
        throw Error('No document find with that ID!');
      }

      return res.status(200).json({ status: 'success', data: { user } });
    } catch (error) {
      return res.status(404).json({ status: 'error', message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);

      if (!user) {
        throw Error('No document find with that ID!');
      }

      return res.status(204).json({ status: 'success' });
    } catch (error) {
      return res.status(404).json({ status: 'error', message: error.message });
    }
  }
}

module.exports = new UserController();
