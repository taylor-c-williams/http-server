// Should match POST /synths and GEt /synths/:id

// Should GET /synths

// Should PUT /synths/:id

// Should DELETE /synths/:id

const SimpleDB = require('./SimpleDB');
const bodyParser = require('./bodyParser');
const database = new SimpleDB(`${__dirname}/../store`);

const synthRouter = {
  async post(req, res) {},

  async get(req, res) {},

  async put(req, res) {},

  async delete(req, res) {},
};

module.exports = synthRouter;
