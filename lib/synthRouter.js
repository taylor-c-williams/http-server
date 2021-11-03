// Should match POST /synths and GEt /synths/:id

// Should GET /synths

// Should PUT /synths/:id

// Should DELETE /synths/:id

const SimpleDB = require('./SimpleDB');
const bodyParser = require('./bodyParser');
const database = new SimpleDB(`${__dirname}/../store/synths`);

function setResponse(res, object) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(object));
}

const synthRouter = {
  async post(req, res) {
    const synth = await bodyParser(req);
    await database.save(synth);
    const savedSynth = await database.get(synth.id);
    setResponse(res, savedSynth);
    // res.setHeader('Content-Type', 'application/json');
    // res.end(JSON.stringify(savedSynth));
  },

  async get(req, res) {
    const [, , id] = req.url.split('/');
    if (id) {
      const synth = await database.get(id);
      setResponse(res, synth);
      // res.statusCode = 200;
      // res.setHeader('Content-Type', 'application/json');
      // res.end(JSON.stringify(synth));
    } else {
      const synths = await database.getAll();
      setResponse(res, synths);
      // res.statusCode = 200;
      // res.setHeader ('Content-Type', 'application/json');
      // res.end(JSON.stringify(synths));
    }
  },

  async put(req, res) {
    const [, , id] = req.url.split('/');
    // const synth = bodyParser(req);
    const synth = await database.update(id);
    setResponse(res, synth);
  },

  async delete(req, res) {
    const [, , id] = req.url.split('/');
    const synth = await database.remove(id);
    setResponse(res, synth);
  },
};

module.exports = synthRouter;
