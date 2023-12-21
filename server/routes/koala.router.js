const express = require('express');
const koalaRouter = express.Router();

const koalaList = require('../data/koalas');
console.table(koalaList);
// DB CONNECTION


// GET
koalaRouter.get('/', (req, res) => {
  res.send(koalaList);
});



// POST
koalaRouter.post('/', (req, res) => {
  let newKoala = req.body;

  res.sendStatus(200);
  return;

});

// PUT


// DELETE

module.exports = koalaRouter;