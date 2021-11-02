const SimpleDB = require('./SimpleDB');
const database = new SimpleDB(`${__dirname}/../store`);

const synthRouter = {
  async post(req, res) {},

  async get(req, res) {},

  async put(req, res) {},

  async delete(req, res) {},
};

module.exports = synthRouter;
