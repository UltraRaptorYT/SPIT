/*
Name: Soh Hong Yu
Class: DAAA/FT/1B/01
Admin No.: P2100775
*/
const fs = require("fs");
var db = require("./databaseConfig");

var userDB = {
  insertUser: (userObj, profile_pic, callback) => {
    var conn = db.getConnection(); // Get Connection
    conn.connect((err) => {
      // Check for error
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      var { username, email, contact, password, type } = userObj; // Deconstruct userObj
      console.log("Connected!");
      // Check type of userObj
      if (type != "Customer" && type != "Admin") {
        console.log("Invalid Type");
        return callback("Invalid Type", null);
      }
      // sql statement
      var sql = `insert into user (username,email,contact,password,type,profile_pic_url) values (?,?,?,?,?,?)`;
      conn.query(
        sql,
        [username, email, contact, password, type, profile_pic],
        (err, result) => {
          conn.end();
          // Check for error
          if (err) {
            console.log(err);
            return callback(err, null);
          }
          console.log(result);
          return callback(null, result);
        }
      );
    });
  },
  getAllUsers: (callback) => {
    var conn = db.getConnection(); // Get Connection
    conn.connect((err) => {
      // Check for error
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log("Connected!");
      // sql statement
      var sql = `select userid,username,email,contact,type,profile_pic_url,created_at from user`;
      conn.query(sql, (err, result) => {
        conn.end();
        // Check for error
        if (err) {
          console.log(err);
          return callback(err, null);
        }
        console.log(result);
        return callback(null, result);
      });
    });
  },
  getUserByID: (userid, callback) => {
    var conn = db.getConnection(); // Get Connection
    conn.connect((err) => {
      // Check for error
      if (err) {
        console.log(err);
        callback(err, null);
        return;
      }
      console.log("Connected!");
      // sql statement
      var sql = `select userid,username,email,contact,type,profile_pic_url,created_at from user where userid = ?`;
      conn.query(sql, [userid], (err, result) => {
        conn.end();
        // Check for error
        if (err) {
          console.log(err);
          callback(err, null);
          return;
        }
        console.log(result);
        callback(null, result);
        return;
      });
    });
  },
  updateUser: (id, userObj, profile_pic, defaultInfo, callback) => {
    var conn = db.getConnection(); // Get Connection
    conn.connect((err) => {
      // Check for error
      if (err) {
        console.log(err);
        callback(err, null);
        return;
      }
      console.log("Connected!");
      // sql statement
      var sql1 = `select * from user where userid = ?`;
      conn.query(sql1, [id], (err1, result1) => {
        if (err1) {
          console.log(err1);
          return callback(err1, null);
        }
        console.log(result1);
        console.log(userObj);
        // Check if user exist
        if (result1[0] == undefined) {
          return callback(null, null);
        }
        // if there is no body
        // use old data
        var original_username = result1[0].username;
        var original_email = result1[0].email;
        var original_contact = result1[0].contact;
        var original_password = result1[0].password;
        var original_type = result1[0].type;
        var original_profile_pic_url = result1[0].profile_pic_url;
        var { username, email, contact, password, type } = userObj;
        if (username == "" || username == undefined)
          username = original_username;
        if (email == "" || email == undefined) email = original_email;
        if (contact == "" || contact == undefined) contact = original_contact;
        if (password == "" || password == undefined)
          password = original_password;
        if (type == "" || type == undefined) type = original_type;
        var profile_pic_url = original_profile_pic_url;
        // default picture
        if (profile_pic != "./img/default.png" || defaultInfo) {
          var profile_pic_url = profile_pic;
        }
        // sql statement
        var sql = `update user set username = ?, email=?,contact=?,password=?, type=?, profile_pic_url=? where userid = ?`;
        conn.query(
          sql,
          [username, email, contact, password, type, profile_pic_url, id],
          (err, result) => {
            conn.end();
            // Check for error
            if (err) {
              console.log(err);
              return callback(err, null);
            }
            console.log(result);
            return callback(null, result);
          }
        );
      });
    });
  },
  addInterest: (id, categoryObj, callback) => {
    var conn = db.getConnection(); // Get Connection
    conn.connect(async (err) => {
      // Check for error
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log("Connected!");
      var { categoryids } = categoryObj;
      var categoryArr = categoryids.split(",");
      // sql statement
      // only insert if interest is valid and is not duplicated
      var sql = `insert into interest (userid,categoryid) 
        select * from (select ? as userid, ? as categoryid) as tmp
        where not exists (select * from interest where userid = ? and categoryid = ?)`;
      for await (var element of categoryArr) {
        conn.query(
          sql,
          [id, parseInt(element), id, parseInt(element)],
          (err, result) => {
            // Check for error
            if (err) {
              console.log(err);
              return callback(err, null);
            }
            console.log(result);
            return callback(null, result);
          }
        );
      }
      conn.end();
    });
  },
  login: (userObj, callback) => {
    var conn = db.getConnection();
    var { email, password } = userObj;
    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        console.log("Connected!");
        var sql = `select userid,username,email,contact,type,profile_pic_url from user where binary email = ? and binary password = ?`;
        conn.query(sql, [email, password], (err, result) => {
          conn.end();
          if (err) {
            console.log(err);
            return callback(err, null);
          }
          console.log(result);
          return callback(null, result);
        });
      }
    });
  },
  getInterest: (userid, callback) => {
    var conn = db.getConnection();
    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log("Connected!");
      var sql = `select * from interest where userid = ?`;
      conn.query(sql, [userid], (err, result) => {
        conn.end();
        if (err) {
          console.log(err);
          return callback(err, null);
        }
        console.log(result);
        return callback(null, result);
      });
    });
  },
  deleteInterest: (id, categoryObj, callback) => {
    var conn = db.getConnection(); // Get Connection
    conn.connect(async (err) => {
      // Check for error
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log("Connected!");
      var { categoryids } = categoryObj;
      var categoryArr = categoryids.split(",");
      // sql statement
      // only insert if interest is valid and is not duplicated
      var sql = `delete from interest where userid = ? and categoryid = ?`;
      await categoryArr.forEach((element) => {
        console.log(element);
        conn.query(sql, [id, parseInt(element)], (err, result) => {
          // Check for error
          if (err) {
            console.log(err);
            return callback(err, null);
          }
          console.log(result);
          return callback(null, result);
        });
      });
      conn.end();
    });
  },
};

module.exports = userDB;
