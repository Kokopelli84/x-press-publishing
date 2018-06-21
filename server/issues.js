const express = require('express');
const issuesRouter = express.Router({ mergeParams: true });
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');



issuesRouter.get('/', (req, res) => {
  db.all('SELECT * FROM Issue WHERE series_id = $id',
    { $id: req.seriesId },
    (err, rows) => {
    if (rows.length === 0) {
      rows = [];
    }
    res.send({ issues: rows });
  });
});

issuesRouter.post('/', (req, res) => {
  const newIssue = req.body.issue;
  db.run('INSERT INTO Issue (name, issue_number, publication_date, artist_id, series_id) VALUES ($name, $issue_number, $publication_date, $artist_id, $series_id)',
  {
    $name: newIssue.name,
    $issue_number: newIssue.issueNumber,
    $publication_date: newIssue.publicationDate,
    $artist_id: newIssue.artistId,
    $series_id: req.seriesId
  },
  function(err) {
    if (err) {
      return res.sendStatus(400);
    }
    db.get(`SELECT * FROM Issue WHERE id = ${this.lastID}`,
      (err, row) => {
        res.status(201).send({ issue: row });
    });
  });
});

// seriesRouter.put('/:seriesId', (req, res) => {
//   const seriesToUpdate = req.body.series;
//   db.run(`UPDATE Series SET name = $name, description = $description WHERE id = ${req.seriesId}`,
//   {
//     $name: seriesToUpdate.name,
//     $description: seriesToUpdate.description
//   },
//   function(err) {
//     if (err) {
//       return res.sendStatus(400);
//     }
//     db.get(`SELECT * FROM Series WHERE id = ${req.seriesId}`,
//       (err, row) => {
//         res.send({ series: row });
//     });
//   });
// });

module.exports = issuesRouter;
