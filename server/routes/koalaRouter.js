const express = require('express');
const koalaRouter = express.Router();

// DB CONNECTION
const pool = require('../database/pool');

// GET
koalaRouter.get('/', (req, res) => {
  console.log('In /koalas GET Route:');

  const queryText = `SELECT * FROM "koalas" ORDER BY "id" ASC`;
  
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

  koalaRouter.get('/filter/', (req, res) => {
    console.log('/koalas/filter GET route');
    console.log('req.query', req.query);
    let filterCriteria = req.query;
    console.log('filterCriteria:', filterCriteria);

    const queryArgs = [];
    placeHolderCount = 0;

    // Assemble query text
    let queryText = `SELECT * FROM "koalas" WHERE ("id" > 0`;
    if (filterCriteria.name != '') {
      queryText += ` AND "name" ILIKE $xPHx`;
      queryArgs.push(`%${filterCriteria.name}%`);
      placeHolderCount++;
    }
    if (filterCriteria.age != '') {
      queryText += ` AND "age" = $xPHx`;
      queryArgs.push(+filterCriteria.age);
      placeHolderCount++
    }
    if (filterCriteria.gender != '') {
      queryText += ` AND "gender" ILIKE $xPHx`;
      queryArgs.push(`%${filterCriteria.gender}%`);
      placeHolderCount++;
    }
    if (filterCriteria.ready_to_transfer != '') {
      queryText += ` AND "ready_to_transfer" ILIKE $xPHx`;
      queryArgs.push(`%${filterCriteria.ready_to_transfer}%`);
      placeHolderCount++;
    }
    if (filterCriteria.notes != '') {
      queryText += ` AND "notes" ILIKE $xPHx`;
      queryArgs.push(`%${filterCriteria.notes}%`);
      placeHolderCount++;
    }
    queryText += `) ORDER BY "id" ASC;`;

    // match placeholders
    for (let count = 1; count <= placeHolderCount; count++) {
      queryText = queryText.replace('xPHx', count);
    }

    // Unique Case where all search criteria are NULL
    if (filterCriteria.name == '' && filterCriteria.age == '' && filterCriteria.gender == '' 
      && filterCriteria.ready_to_transfer == '' && filterCriteria.notes == '') {
        queryText = `SELECT * FROM "koalas" ORDER BY "id" ASC;`
      }

    console.log('queryText: ', queryText);
    console.log('queryArgs', queryArgs);

    pool.query(queryText, queryArgs)
    .then((response) => {
      console.log(response.rows);
      res.send(response.rows);
    })
    .catch((err) => {
      console.log('ERROR in /filter query', err);
      res.sendStatus(500);
    });

  
    // res.sendStatus(200);
  });

// POST
koalaRouter.post('/', (req, res) => {
  let newKoala = req.body;
  // console.log('req.body', req.body);
  
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

koalaRouter.put('/ready/:koalaIndex', (req, res) => {
  console.log('/koalas/ready PUT route with params:', req.params);
  let koalaId = +req.params.koalaIndex;
  // get current status of koala
  let queryText = `SELECT "ready_to_transfer" from "koalas" WHERE "id" = $1`;
  let queryArgs = [koalaId];
  let transferReady; 
  
  pool.query(queryText, queryArgs)
    .then((result) => {
      console.log('Result', result.rows[0].ready_to_transfer);
      transferReady = result.rows[0].ready_to_transfer;

      if (transferReady.toUpperCase() === 'Y') {
        queryText = `UPDATE "koalas" SET "ready_to_transfer" = 'N' WHERE "id" = $1`;
      } else {
        queryText = `UPDATE "koalas" SET "ready_to_transfer" = 'Y' WHERE "id" = $1`;
      }
      
      // toggle read_to_transfer
      pool.query(queryText, queryArgs)
      .then((result) => {    
        res.sendStatus(200);
      })
      .catch((err) => {
        console.error('ERROR in transfer toggle Query:', err);
        sendStatus(500);
      });
    })
    .catch((err) => {
      console.error('ERROR in transferReady Query:', err);
    });

});

// DELETE
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
});

module.exports = koalaRouter;