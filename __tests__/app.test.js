const request = require('supertest');
const app = require('../lib/app');
const { rm, mkdir } = require('fs/promises');
const rootDir = `${__dirname}/../store/synths`;

const SimpleDB = require('../lib/SimpleDB.js');

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

describe('http server + CRUD API', () => {
  it('creates a new database object and returns it via POST', async () => {
    const synth = { model: 'Juno 6', analog: true };
    const res = await request(app).post('/synths').send(synth);

    expect(res.body).toEqual({ ...synth, id: expect.any(String) });
  });

  it('gets all synths when no ID is supplied', async () => {
    const juno6 = { model: 'Juno 6', analog: true };
    const minimoog = { model: 'Minimoog', analog: true };
    const prophet5 = { model: 'Prophet 5', analog: true };
    const database = new SimpleDB(rootDir);
    Promise.all([
      database.save(juno6),
      database.save(minimoog),
      database.save(prophet5),
    ]);

    const res = await request(app).get('/synths/');
    expect(res.body).toEqual(
      expect.arrayContaining([juno6, minimoog, prophet5])
    );
  });

  it('gets one synth by id', async () => {
    const synth = { model: 'Juno 6', analog: true };

    const database = new SimpleDB(rootDir);
    await database.save(synth);

    const res = await request(app).get(`/synths/${synth.id}`);
    expect(res.body).toEqual(synth);
  });
});
