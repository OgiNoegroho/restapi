const mysql = require('mysql');
require('dotenv').config();

const hostname = process.env.DB_HOST;
const database = process.env.DB_DATABASE;
const port = process.env.DB_PORT;
const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

const db = mysql.createConnection({
  host: hostname,
  user: username,
  password: password,
  database: database,
  port: port,
});

db.connect(function (err) {
  if (err) throw err;
  console.log('Connected!');
});

db.query('SELECT 1+1').on('result', function (row) {
  console.log(row);
});

module.exports = db;
