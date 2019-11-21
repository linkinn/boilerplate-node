class FactoryController {
  constructor(Model) {
    this.doc = Model;

    this.index = this.index.bind(this);
    this.show = this.show.bind(this);
    this.store = this.store.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async index(req, res) {
    const doc = await this.doc.find();

    return res
      .status(200)
      .json({ status: 'success', results: doc.length, data: { doc } });
  }

  async show(req, res) {
    try {
      const doc = await this.doc.findById(req.params.id);

      if (!doc) {
        throw Error('No document find with that ID!');
      }

      return res.status(200).json({ status: 'success', data: { doc } });
    } catch (error) {
      return res.status(404).json({ status: 'error', message: error.message });
    }
  }

  async store(req, res) {
    const doc = await this.doc.create(req.body);

    return res.status(201).json({ status: 'success', data: { doc } });
  }

  async update(req, res) {
    try {
      const doc = await this.doc.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });

      if (!doc) {
        throw Error('No document find with that ID!');
      }

      return res.status(200).json({ status: 'success', data: { doc } });
    } catch (error) {
      return res.status(404).json({ status: 'error', message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const doc = await this.doc.findByIdAndDelete(req.params.id);

      if (!doc) {
        throw Error('No document find with that ID!');
      }

      return res.status(204).json({ status: 'success' });
    } catch (error) {
      return res.status(404).json({ status: 'error', message: error.message });
    }
  }
}

module.exports = FactoryController;
