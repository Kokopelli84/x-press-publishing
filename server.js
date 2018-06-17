const express = require('express');
const app = express();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');
const apiRouter = require('./server/api');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(cors());
//app.use(morgan('dev'));

app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

module.exports = app;
