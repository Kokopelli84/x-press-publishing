const express = require('express');
const seriesRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');


// middleware for checking a valid series
seriesRouter.use('/:seriesId', (req, res, next) => {
  db.get('SELECT * FROM Series WHERE id = $id',
    { $id: req.params.seriesId },
    (err, row) => {
    if (err || !row) {
      return res.sendStatus(404);
    }
    next();
  });
});

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
    res.send({ series: row });
  });
});

seriesRouter.post('/', (req, res) => {
  const newSeries = req.body.series;
  db.run('INSERT INTO Series (name, description) VALUES ($name, $description)',
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
        res.status(201).send({ series: row });
    });
  });
});

seriesRouter.put('/:seriesId', (req, res) => {
  const seriesToUpdate = req.body.series;
  db.run(`UPDATE Series SET name = $name, description = $description WHERE id = ${req.params.seriesId}`,
  {
    $name: seriesToUpdate.name,
    $description: seriesToUpdate.description
  },
  function(err) {
    if (err) {
      return res.sendStatus(400);
    }
    db.get(`SELECT * FROM Series WHERE id = ${req.params.seriesId}`,
      (err, row) => {
        res.send({ series: row });
    });
  });
});

seriesRouter.delete('/:seriesId', (req, res) => {
  db.get(`SELECT * FROM Issue WHERE series_id = ${req.params.seriesId}`,
  (err, row) => {
    if (row) {
      return res.sendStatus(400);
    }
    db.run(`DELETE FROM Series WHERE id = ${req.params.seriesId}`,
    (err) => {
      if (err) {
        return res.sendStatus(404);
      }
      res.sendStatus(204);
    });
  })
});

// Router for handleing /:seriesId/issues routes
const issuesRouter = require('./issues')
seriesRouter.use('/:seriesId/issues', issuesRouter);

module.exports = seriesRouter;
