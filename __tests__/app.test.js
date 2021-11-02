const request = require('supertest');
const app = require('../lib/app');
const { rm, mkdir } = require('fs/promises');
const rootDir = `${__dirname}/store`;

describe('http server + CRUD API', () => {
  beforeEach(() => {
    return rm(rootDir, { force: true, recursive: true }).then(() =>
      mkdir(rootDir, { recursive: true })
    );
  });

  afterAll(() => {
    return rm(rootDir, { force: true, recursive: true }).then(() =>
      mkdir(rootDir, { recursive: true })
    );
  });

  it('creates a new database object and returns it via POST', async () => {
    const synth = { model: 'Juno 6', analog: true };
    const res = await (await request(app).post('/synths')).send(synth);

    expect(res.body).toEqual({ ...synth, id: expect.any(String) });
  });
});
