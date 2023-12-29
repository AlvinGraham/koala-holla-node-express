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
koalaRouter.delete('/ready/:koalaIndex', (req, res) => {
  console.log('/koalas/ready DELETE route with params:', req.params);
  let koalaId = +req.params.koalaIndex;

  for (let item of koalaList) {
    if (item.id === koalaId) {
      item.ready_to_transfer = 'Y';
    }
  }
  // console.log('New koalaList (DELETE route ..ready/');
  // console.table(koalaList);
  
  res.sendStatus(200);
});

koalaRouter.delete('/:koalaIndex', (req, res) => {
  console.log('/koalas/ready DELETE route with params:', req.params);
  let koalaId = +req.params.koalaIndex;
  // find index of element with target ID
  let targetIndex = koalaList.findIndex((element) => +element.id == koalaId);

  //console.log('Target Index:', targetIndex);
  // delete element 
  koalaList.splice(targetIndex, 1);
  console.log('New koalaList (DELETE route');
  console.table(koalaList);

  res.sendStatus(200);
});

module.exports = koalaRouter;