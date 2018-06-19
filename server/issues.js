const express = require('express');
const issuesRouter = express.Router({ mergeParams: true });
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');



issuesRouter.get('/', (req, res) => {
  db.all('SELECT * FROM Issue WHERE series_id = $id',
    { $id: req.params.seriesId },
    (err, rows) => {
    if (err || rows.length === 0) {
      return res.send({ issues: []});
    }
    res.send({ issues: rows });
  });
});

module.exports = issuesRouter;
