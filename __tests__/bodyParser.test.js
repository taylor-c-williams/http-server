const EventEmitter = require('events');
const bodyParser = require('../lib/bodyParser.js');

it('returns null if the method is not POST, PUT or PATCH', async () => {
  expect(await bodyParser({ method: 'GET' })).toBe(null);
});
