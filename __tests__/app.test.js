const request = require('supertest');
const app = require('../lib/app');
const { rm, mkdir } = require('fs/promises');
const rootDir = `${__dirname}/../store/synths`;

const SimpleDB = require('../lib/SimpleDB.js');
const database = new SimpleDB(rootDir);

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
  // POST
  it('creates a new database object and returns it via POST', async () => {
    const synth = { model: 'Juno 6', analog: true };
    const res = await request(app).post('/synths').send(synth);

    expect(res.body).toEqual({ ...synth, id: expect.any(String) });
  });

  // GET ALL
  it('gets all synths when no ID is supplied', async () => {
    const juno6 = { model: 'Juno 6', analog: true };
    const minimoog = { model: 'Minimoog', analog: true };
    const prophet5 = { model: 'Prophet 5', analog: true };

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

  // GET BY ID
  it('gets one synth by id', async () => {
    const synth = { model: 'Juno 6', analog: true };

    await database.save(synth);

    const res = await request(app).get(`/synths/${synth.id}`);
    expect(res.body).toEqual(synth);
  });

  // DELETE
  it('deletes one synth by id', async () => {
    const synth = { model: 'Prophet 5', analog: true };

    await database.save(synth);

    await request(app).delete(`/synths/${synth.id}`);
    const res = await database.get(synth.id);
    expect(res).toBeNull();
  });

  // PUT
  it('updates one synth', async () => {
    const synth = { model: 'Juno 6', analog: true };
    await database.save(synth);

    const update = { model: 'Prophet 5', analog: true };

    const res = await request(app).put(`/synths/${synth.id}`).send(update);

    expect(res.body).toEqual({ ...update, id: expect.any(String) });
  });
});
