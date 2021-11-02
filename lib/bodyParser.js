const VALID = ['POST', 'PUT', 'PATCH'];

const bodyParser = async (req) => {
  //  ✔︎ Returns null if method is not POST, PUT or PATCH
  if (!VALID.includes(req.method)) return null;

  return new Promise((resolve, reject) => {
    // ✔︎ Throws if content-type is not application/JSON
    if (req.headers['content-type'] !== 'application/JSON') {
      reject('Bad pun, must be J, SON');
      return;
    }

    let data = '';

    req.on('data', (chunk) => {
      data += chunk;
    });

    //  ✔︎ Returns deserialized body from req emitted events using JSON.parse
    req.on('end', async () => {
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        // ✔︎ Throws if failure happens during de-serialization
        reject('Big Nope, JSON!');
      }
    });
  });
};

module.exports = bodyParser;
