const express = require('express');
const app = express();
const PORT = process.env.PORT || 5001;
const koalaRouter = require('./routes/koalaRouter');

// statics
app.use(express.json());
app.use(express.static('server/public'));

// ROUTES
app.use('/koalas', koalaRouter);

// Start listening for requests on a specific port
app.listen(PORT, () => {
  console.log('listening on port', PORT);
});
