const request = require('supertest');
const app = require('../lib/app');
const pool = require('../lib/utils/pool');
const fs = require('fs');
const Child = require('../lib/models/Children');
const Toy = require('../lib/models/Toys');

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

  // it('finds a child by id via GET', async() => {
  //   const child = await Child.insert({
  //     name: 'Joey',
  //     age: 6,
  //   });

  //   const res = await request(app)
  //     .get(`/api/v1/children/${child.id}`);

  //   expect(res.body).toEqual(child);
  // });

  it('finds a child by id and associated toys via GET', async() => {
    const child = await Child.insert({
      name: 'Joey',
      age: '6'
    });

    const toys = await Promise.all([
      { type: 'stuffed',
        name: 'bear',
        color: 'brown',
        childId: child.id 
      },
      { type: 'stuffed',
        name: 'dog',
        color: 'black',
        childId: child.id 
      },
      { type: 'stuffed',
        name: 'zebra',
        color: 'rainbow',
        childId: child.id 
      },
    ].map(toy => Toy.insert(toy)));

    const res = await request(app)
      .get(`/api/v1/children/${child.id}`);

    expect(res.body).toEqual({
      ...child,
      toys: expect.arrayContaining(toys)
    });
  });

  it('finds all children via GET', async() => {
    const children = await Promise.all([
      {
        name: 'Jamie',
        age: 12,
      },
      {
        name: 'Joey',
        age: 6,
      },
      {
        name: 'Dani',
        age: 9,
      }
    ].map(child => Child.insert(child)));

    const res = await request(app)
      .get('/api/v1/children');
    
    expect(res.body).toEqual(expect.arrayContaining(children));
    // expect(res.body).toHaveLength(child.length);
  });

  it('updates a child via PUT', async() => {
    const child = await Child.insert({
      name: 'Joey',
      age: 6
    });

    const res = await request(app)
      .put(`/api/v1/children/${child.id}`)
      .send({
        name: 'Joey',
        age: 9
      });
    
    expect(res.body).toEqual({
      id: child.id,
      name: 'Joey',
      age: 9
    });

  });

  it('removes a child via DELETE', async() => {
    const child = await Child.insert({
      name: 'Joey',
      age: 6 
    });
    
    const response = await request(app)
      .delete(`/api/v1/children/${child.id}`);

    expect(response.body).toEqual(child);
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

  it('finds a toy by id via GET', async() => {
    const toy = await Toy.insert({
      type: 'stuffed',
      name: 'bear',
      color: 'brown',
      // childId: child.id,
    });


    const res = await request(app)
      .get(`/api/v1/toys/${toy.id}`);

    expect(res.body).toEqual(toy);
  });

  it('finds all toys via GET', async() => {
    const toys = await Promise.all([
      {
        type: 'stuffed',
        name: 'bear',
        color: 'brown',
        childId: child.id,
      },
      {
        type: 'stuffed',
        name: 'dog',
        color: 'black',
        childId: child.id,
      },
      {
        type: 'stuffed',
        name: 'zebra',
        color: 'rainbow',
        childId: child.id,
      }
    ].map(toy => Toy.insert(toy)));

    const res = await request(app)
      .get('/api/v1/toys');
    
    expect(res.body).toEqual(expect.arrayContaining(toys));
    // expect(res.body).toHaveLength(child.length);
  });

  it('updates a toy via PUT', async() => {
    const toy = await Toy.insert({
      type: 'stuffed',
      name: 'zebra',
      color: 'rainbow',
    });

    const res = await request(app)
      .put(`/api/v1/toys/${toy.id}`)
      .send({
        type: 'stuffed',
        name: 'zebra',
        color: 'black and white',
      });
    
    expect(res.body).toEqual({
      ...toy,
      type: 'stuffed',
      name: 'zebra',
      color: 'black and white',
    });

  });

  it('removes a toy via DELETE', async() => {
    const toy = await Toy.insert({
      type: 'stuffed',
      name: 'zebra',
      color: 'rainbow', 
    });
    
    const response = await request(app)
      .delete(`/api/v1/toys/${toy.id}`);

    expect(response.body).toEqual(toy);
  });

  afterAll(() => {
    return pool.end();
  });
});
