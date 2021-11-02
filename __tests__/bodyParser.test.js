const EventEmitter = require('events');
const bodyParser = require('../lib/bodyParser.js');

it('returns null if the method is not POST, PUT or PATCH', async () => {
  expect(await bodyParser({ method: 'GET' })).toBe(null);
  expect(await bodyParser({ method: 'DELETE' })).toBe(null);
});

it('throws if content-type is not JSON', async () => {
  const req = {
    method: 'POST',
    headers: {
      'content-type': 'text/html',
    },
  };
  expect.assertions(1);
  try {
    await bodyParser(req);
  } catch (e) {
    expect(e).toEqual('Content-Type must be application/json');
  }
});

it('returns deserialized body from req emitted events', async () => {
  const req = new EventEmitter();
  req.headers = { 'content-type': 'application/json' };
  req.method = 'POST';
  const promise = bodyParser(req);
  req.emit('data', '{"bond":');
  req.emit('data', '"james bond"}');
  req.emit('end');

  const body = await promise;
  expect(body).toEqual({ bond: 'james bond' });
});

it('throws if parsing fails', async () => {
  const req = new EventEmitter();
  req.headers = { 'content-type': 'application/json' };
  req.method = 'POST';
  const promise = bodyParser(req);
  req.emit('data', '{"bad empanada"}');
  req.emit('end');

  expect.assertions(1);
  try {
    await promise;
  } catch (e) {
    expect(e).toEqual('JSON FAIL');
  }
});
