const express = require('express');
const koalaRouter = express.Router();

// const koalaList = require('../data/koalas');
// console.table(koalaList);

// DB CONNECTION
const pool = require('../database/pool');


// GET
koalaRouter.get('/', (req, res) => {
  console.log('In /koalas GET Route')

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

koalaRouter.post('/edit/:koalaIndex', (req, res) => {
  console.log('/koalas/edit POST route with params:', req.params);
  let koalaId = +req.params.koalaIndex;
  let targetIndex = koalaList.findIndex((element) => element.id === koalaId);
  let koalaEdits = req.body;

  koalaList[targetIndex].name = koalaEdits.name;
  koalaList[targetIndex].gender = koalaEdits.gender;
  koalaList[targetIndex].age = koalaEdits.age;
  koalaList[targetIndex].notes = koalaEdits.notes;

  console.log('Koala edited:', koalaList[targetIndex]);


  res.sendStatus(200);
});

koalaRouter.post('/filter', (req, res) => {
  console.log('/koalas/filter POST route');

  let filterCriteria = req.body;
  let filteredKoalas = koalaList;  

  if (filterCriteria.name) {
    filteredKoalas = filteredKoalas.filter((element) => {
      return element.name.toUpperCase().includes(filterCriteria.name.toUpperCase());
    });
  }
  if (filterCriteria.age) {
    filteredKoalas = filteredKoalas.filter((element) => {
      return element.age.toString().includes(filterCriteria.age.toString());
    });
  }
  if (filterCriteria.gender) {
    filteredKoalas = filteredKoalas.filter((element) => {
      return element.gender.toUpperCase().includes(filterCriteria.gender.toUpperCase());
    });
  }
  if (filterCriteria.ready_to_transfer) {
    filteredKoalas = filteredKoalas.filter((element) => {
      return element.ready_to_transfer.toUpperCase().includes(filterCriteria.ready_to_transfer.toUpperCase());
    });
  }
  if (filterCriteria.notes) {
    filteredKoalas = filteredKoalas.filter((element) => {
      return element.notes.toUpperCase().includes(filterCriteria.notes.toUpperCase());
    });
  }

  console.log('Filtered koalaList');
  console.table(filteredKoalas);

  res.send(filteredKoalas);
});

// PUT


// DELETE
koalaRouter.delete('/ready/:koalaIndex', (req, res) => {
  console.log('/koalas/ready DELETE route with params:', req.params);
  let koalaId = +req.params.koalaIndex;
  let targetIndex = koalaList.findIndex((element) => element.id === koalaId);

  if (koalaList[targetIndex].ready_to_transfer.toUpperCase() === 'Y') {
    koalaList[targetIndex].ready_to_transfer = 'N';
  } else {
    koalaList[targetIndex].ready_to_transfer = 'Y';
  }

  // console.log('New koalaList (DELETE route ..ready/');
  // console.table(koalaList);
  
  res.sendStatus(200);
});

koalaRouter.delete('/:koalaIndex', (req, res) => {
  console.log('/koalas/ready DELETE route with params:', req.params);
  let koalaId = +req.params.koalaIndex;
  // find index of element with target ID
  let targetIndex = koalaList.findIndex((element) => +element.id === koalaId);

  //console.log('Target Index:', targetIndex);
  // delete element 
  koalaList.splice(targetIndex, 1);
  console.log('New koalaList (DELETE route');
  console.table(koalaList);

  res.sendStatus(200);
});



module.exports = koalaRouter;