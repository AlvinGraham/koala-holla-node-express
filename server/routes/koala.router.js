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


// PUT


// DELETE

module.exports = koalaRouter;