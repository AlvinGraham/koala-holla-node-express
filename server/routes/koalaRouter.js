const express = require('express');
const koalaRouter = express.Router();

// const koalaList = require('../data/koalas');
// console.table(koalaList);

// DB CONNECTION
const pool = require('../database/pool');


// GET
koalaRouter.get('/', (req, res) => {
  console.log('In /koalas GET Route:');

  const queryText = `SELECT * FROM "koalas"`;
  
  pool
    .query(queryText)
    .then((result) => {
      // console.log('RESULT', result.rows);
      res.send(result.rows);
    })
    .catch((err) => {
      console.log('ERROR:', err);
      res.sendStatus(500);
    });
  });

// POST
koalaRouter.post('/', (req, res) => {
  let newKoala = req.body;
  
  const queryText = `INSERT INTO "koalas" ("name", "gender", "age", "ready_to_transfer", "notes")
  VALUES
    ($1, $2, $3, $4, $5);`;
  const queryArgs = [
    newKoala.name,
    newKoala.gender,
    newKoala.age,
    newKoala.ready_to_transfer,
    newKoala.notes
  ];

  pool
    .query(queryText, queryArgs)
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log('ERROR:', err);

      res.sendStatus(500);
    });
  //res.sendStatus(200);
  return;

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

koalaRouter.put('/edit/:koalaIndex', (req, res) => {
  console.log('/koalas/edit POST route with params:', req.params);
  let koalaId = req.params.koalaIndex;
//  let targetIndex = koalaList.findIndex((element) => element.id === koalaId);
  let koalaEdits = req.body;

  const queryText = `UPDATE "koalas" SET ("name", "gender", "age", "notes") = 
    ($1, $2, $3, $4) WHERE "id" = $5;`
  const queryArgs = [
    koalaEdits.name,
    koalaEdits.gender,
    koalaEdits.age,
    koalaEdits.notes,
    koalaId
  ];
  console.log('queryArgs:', queryArgs);

  pool
    .query(queryText, queryArgs)
    .then((result) => {
      // console.log('RESULT', result.rows);
      res.send(result.rows);
    })
    .catch((err) => {
      console.log('ERROR:', err);
      res.sendStatus(500);
    });
});

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
  let koalaId = req.params.koalaIndex;
  // find index of element with target ID
  // let targetIndex = koalaList.findIndex((element) => +element.id === koalaId);

  const queryText = `DELETE FROM "koalas" WHERE "id" = $1`;
  const queryArgs = [koalaId];

  pool
  .query(queryText, queryArgs)
  .then((result) => {
    res.sendStatus(201);
  })
  .catch((err) => {
    console.log('ERROR:', err);

    res.sendStatus(500);
  });
  
  //console.log('Target Index:', targetIndex);
  // delete element 
  // koalaList.splice(targetIndex, 1);
  // console.log('New koalaList (DELETE route');
  // console.table(koalaList);

  // res.sendStatus(200);
});



module.exports = koalaRouter;