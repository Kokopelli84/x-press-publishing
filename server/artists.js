const express = require('express');
const artistRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

artistRouter.get('/', (req, res) => {
  db.all('SELECT * FROM Artist WHERE is_currently_employed = 1;', (err, rows) => {
    if (err || !rows) {
      return res.sendStatus(500);
    }
    res.send({artists: rows});
  });
});

artistRouter.get('/:artistId', (req, res) => {
  db.get('SELECT * FROM Artist WHERE id = $id',
    { $id: req.params.artistId },
    (err, row) => {
    if (err || !row) {
      return res.sendStatus(404);
    }
    res.send({ artist: row });
  });
});

artistRouter.post('/', (req, res) => {
  const newArtist = req.body.artist;
  db.run('INSERT INTO Artist (name, date_of_birth, biography) VALUES ($name, $date_of_birth, $biography)',
  {
    $name: newArtist.name,
    $date_of_birth: newArtist.dateOfBirth,
    $biography: newArtist.biography
  },
  function(err) {
    if (err) {
      return res.sendStatus(400);
    }
    db.get(`SELECT * FROM Artist WHERE id = ${this.lastID}`,
      (err, row) => {
        if (err || !row) {
          return res.sendStatus(400);
        }
        res.status(201).send({ artist: row });
    });
  });
});

artistRouter.put('/:artistId', (req, res) => {
  const artistToUpdate = req.body.artist;
  db.run(`UPDATE Artist SET name = $name, date_of_birth = $date_of_birth, biography = $biography, is_currently_employed = $is_currently_employed WHERE id = ${req.params.artistId}`,
  { $name: artistToUpdate.name,
    $date_of_birth: artistToUpdate.dateOfBirth,
    $biography: artistToUpdate.biography,
    $is_currently_employed: artistToUpdate.isCurrentlyEmployed
  },
  function(err) {
    if (err) {
      return res.sendStatus(400);
    }
    db.get(`SELECT * FROM Artist WHERE id = ${req.params.artistId}`,
      (err, row) => {
        res.send({ artist: row });
    });
  });
});

artistRouter.delete('/:artistId', (req, res) => {
  db.serialize(() => {
    db.run('UPDATE Artist SET is_currently_employed = 0 WHERE id = $id',
    { $id: req.params.artistId },
    (err) => {
      if (err) {
        return res.sendStatus(404)
      }
    });
    db.get('SELECT * FROM Artist WHERE id = $id',
      { $id: req.params.artistId },
      (err, row) => {
        if (err || !row) {
          return res.sendStatus(404);
        }
        res.send({ artist: row });
    });
  })
});

module.exports = artistRouter;
