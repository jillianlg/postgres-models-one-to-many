const request = require('supertest');
const app = require('../lib/app');
const pool = require('../lib/utils/pool');
const fs = require('fs');
const Child = require('../lib/models/Children');

describe('app endpoints', () => {
  let child;
  beforeEach(async() => {
    await pool.query(fs.readFileSync('./data/setup.sql', 'utf-8'));
    child = await Child.insert({
      name: 'Jamie',
      age: 12,
    });
  });
  
  //  CRUD test for ONE CHILD
  it('creates a new child via POST', async() => {
    const res = await request(app)
      .post('/api/v1/children')
      .send({
        name: 'Joey',
        age: 6,
      });

    expect(res.body).toEqual({
      id: '2',
      name: 'Joey',
      age: 6,
    });
  });

  it('finds a child by id via GET', async() => {
    const child = await Child.insert({
      name: 'Joey',
      age: 6,
    });

    const res = await request(app)
      .get(`/api/v1/children/${child.id}`);

    expect(res.body).toEqual(child);
  });

  //  CRUD test for MANY TOYS
  it('creates a new toy via POST', async() => {
    const res = await request(app)
      .post('/api/v1/toys')
      .send({
        type: 'stuffed',
        name: 'bear',
        color: 'brown',
        child_id: child.id,
      });

    expect(res.body).toEqual({
      id: '1',
      type: 'stuffed',
      name: 'bear',
      color: 'brown',
      childId: child.id,
    });
  });

  afterAll(() => {
    return pool.end();
  });
});
