var mysql = require("mysql");

var hostname = "2bj.h.filess.io";
var database = "dummydata_excitedfox";
var port = "3307";
var username = "dummydata_excitedfox";
var password = "2eb7e4375de8860e8cafe340a18bb61ad382d91d";

var database = mysql.createConnection({
  host: hostname,
  user: username,
  password,
  database,
  port,
});

database.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

database.query("SELECT 1+1").on("result", function (row) {
  console.log(row);
});


module.exports = database;
