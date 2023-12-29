const express = require('express');
const koalaRouter = express.Router();

const koalaList = require('../data/koalas');
console.table(koalaList);
// DB CONNECTION


// GET
koalaRouter.get('/', (req, res) => {
  res.send(koalaList);

  return;
});



// POST
koalaRouter.post('/', (req, res) => {
  let newKoala = req.body;
  
  // assign new ID
  let newID = koalaList[koalaList.length-1].id + 1;
  newKoala.id = newID;

  koalaList.push(newKoala);
  console.log('New koalaList:');
  console.table(koalaList);
  res.sendStatus(200);
  return;

});

// PUT


// DELETE

module.exports = koalaRouter;