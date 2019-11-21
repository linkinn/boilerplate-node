const User = require('../schemas/userSchema');

class UserController {
  async index(req, res) {
    const user = await User.find();

    return res
      .status(200)
      .json({ status: 'success', results: user.length, data: { user } });
  }

  async show(req, res) {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        throw Error('User not exist!');
      }

      return res.status(200).json({ status: 'success', data: { user } });
    } catch (error) {
      return res.status(400).json({ status: 'fail', message: error });
    }
  }

  async store(req, res) {
    try {
      const user = await User.create(req.body);

      return res.status(200).json({ status: 'success', data: { user } });
    } catch (error) {
      return res.status(400).json({ status: 'error', message: error });
    }
  }
}

module.exports = new UserController();
