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
// console.log('hi');
});

//  endpoints for MANY TOYS
app.post('/api/v1/toys', (req, res, next) => {
  Toy
    .insert(req.body)
    .then(toy => res.send(toy))
    .catch(next);
// console.log('hi');
});

module.exports = app;
