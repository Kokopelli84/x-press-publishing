const express = require('express');
const seriesRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

seriesRouter.get('/', (req, res) => {
  db.all('SELECT * FROM Series', (err, rows) => {
    if (err || !rows) {
      return res.sendStatus(500);
    }
    res.send({series: rows});
  });
});

seriesRouter.get('/:seriesId', (req, res) => {
  db.get('SELECT * FROM Series WHERE id = $id',
    { $id: req.params.seriesId },
    (err, row) => {
    if (err || !row) {
      return res.sendStatus(404);
    }
    res.send({ series: row });
  });
});

seriesRouter.get('/:seriesId/issues', (req, res) => {
  db.get('SELECT * FROM Issue WHERE series_id = $id',
    { $id: req.params.seriesId },
    (err, row) => {
    if (err || !row) {
      return res.sendStatus(404);
    }
    res.send({ series: row });
  });
});

seriesRouter.post('/', (req, res) => {
  const newSeries = req.body.series;
  db.run('INSERT INTO Artist (name, description) VALUES ($name, $description)',
  {
    $name: newSeries.name,
    $description: newSeries.description
  },
  function(err) {
    if (err) {
      return res.sendStatus(400);
    }
    db.get(`SELECT * FROM Series WHERE id = ${this.lastID}`,
      (err, row) => {
        if (err || !row) {
          return res.sendStatus(400);
        }
        console.log(row);
        res.status(201).send({ series: row });
    });
  });
});

module.exports = seriesRouter;
