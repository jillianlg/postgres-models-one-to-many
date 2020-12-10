const express = require('express');
const Child = require('./models/Children');
const Toy = require('./models/Toys');
const app = express();

app.use(express.json());

//  endpoints for ONE CHILD
app.post('/api/v1/children', (req, res, next) => {
  Child
    .insert(req.body)
    .then(child => res.send(child))
    .catch(next);
});

app.get('/api/v1/children/:id', (req, res, next) => {
  Child
    .findById(req.params.id)
    .then(child => res.send(child))
    .catch(next);
});

app.get('/api/v1/children', (req, res, next) => {
  Child
    .find()
    .then(child => res.send(child))
    .catch(next);
});

app.put('/api/v1/children/:id', (req, res, next) => {
  Child
    .update(req.params.id, req.body)
    .then(child => res.send(child))
    .catch(next);
});

app.delete('/api/v1/children/:id', (req, res, next) => {
  Child
    .delete(req.params.id)
    .then(child => res.send(child))
    .catch(next);
});

//  endpoints for MANY TOYS
app.post('/api/v1/toys', (req, res, next) => {
  Toy
    .insert(req.body)
    .then(toy => res.send(toy))
    .catch(next);
});

app.get('/api/v1/toys/:id', (req, res, next) => {
  Toy
    .findById(req.params.id)
    .then(toy => res.send(toy))
    .catch(next);
});

app.get('/api/v1/toys', (req, res, next) => {
  Toy
    .find()
    .then(toy => res.send(toy))
    .catch(next);
});

app.put('/api/v1/toys/:id', (req, res, next) => {
  Toy
    .update(req.params.id, req.body)
    .then(toy => res.send(toy))
    .catch(next);
});

app.delete('/api/v1/toys/:id', (req, res, next) => {
  Toy
    .delete(req.params.id)
    .then(toy => res.send(toy))
    .catch(next);
});

module.exports = app;
