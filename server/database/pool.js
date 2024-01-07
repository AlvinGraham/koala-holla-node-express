const pg = require('pg');

// config my DB connection
const pool = new pg.Pool({
  database: 'koalas',
  host: 'localhost',
  port: '5432',
});

module.exports = pool;