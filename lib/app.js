const synthRouter = require('./synthRouter.js');

const routes = {
  synths: synthRouter,
};

const app = async (req, res) => {
  const [, resource] = req.url.split('/');
  const route = routes[resource];

  if (route) {
    try {
      const routeHandleFn = route[req.method.toLowerCase()];
      await routeHandleFn(req, res);
    } catch (err) {
      console.error(err);
      res.statusCode = 500;
      res.end(err.message);
    }
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
};

module.exports = app;
