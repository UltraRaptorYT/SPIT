/*
Name: Soh Hong Yu
Class: DAAA/FT/1B/01
Admin No.: P2100775
*/

const mysql = require("mysql");

var dbconnect = {
  getConnection: () => {
    var conn = mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "password", //your own password
      database: "it_products",
      dateStrings: true, // ! convert date to strings
      multipleStatements: true // ! allows for multiple lines of sql
    });
    return conn;
  },
};

// put this at the end of the file
module.exports = dbconnect;
