const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');


const dropTable = (tableName) => {
  return `DROP TABLE IF EXISTS ${tableName}`;
}

const createArtistTable = () => {
  return `CREATE TABLE IF NOT EXISTS Artist(
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    biography TEXT NOT NULL,
    is_currently_employed INTEGER NOT NULL DEFAULT 1
  );`;
}

const createSeriesTable = () => {
  return `CREATE TABLE IF NOT EXISTS Series(
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL
  );`;
}

const createIssueTable = () => {
  return `CREATE TABLE IF NOT EXISTS Issue(
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    issue_number TEXT NOT NULL,
    publication_date TEXT NOT NULL,
    artist_id INTEGER NOT NULL,
    series_id INTEGER NOT NULL,
    FOREIGN KEY (artist_id) REFERENCES Artist(id),
    FOREIGN KEY (series_id) REFERENCES Series(id)
  );`;
}

db.serialize(() => {
  // Drop the tables if they exist
  db.run(dropTable('Artist'));
  db.run(dropTable('Series'));
  db.run(dropTable('Issue'));

  const createArtistQuery = createArtistTable();
  const createSeriesQuery = createSeriesTable();;
  const createIssueQuery = createIssueTable();;

  // Create the tables
  db.run(createArtistQuery, err => {
    if (err) {
          console.log("Error while creating the Artist table!");
          console.log(err);
          return;
        }
  });
  db.run(createSeriesQuery, err => {
    if (err) {
          console.log("Error while creating the Series table!");
          console.log(err);
          return;
        }
  });
  db.run(createIssueQuery, err => {
    if (err) {
          console.log("Error while creating the Issue table!");
          console.log(err);
          return;
        }
  });
  console.log("Tables created");
});
