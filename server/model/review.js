/*
Name: Soh Hong Yu
Class: DAAA/FT/1B/01
Admin No.: P2100775
*/

var db = require("./databaseConfig");

var reviewDB = {
  addReview: (id, reviewObj, callback) => {
    var conn = db.getConnection(); // Get Connection
    conn.connect((err) => {
      // Check Error
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      var { userid, rating, review } = reviewObj; // deconstruct reviewObj
      console.log("Connected!");
      // sql statements
      var sql = `insert into review (productid,userid,rating,review)
      select * from (select ? as productid, ? as userid, ? as rating, ? as review) as tmp
        where not exists (select * from review where productid = ? and userid = ?)`;
      conn.query(
        sql,
        [id, userid, rating, review, id, userid],
        (err, result) => {
          conn.end();
          // Check Error
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
  getReviewByID: (id, callback) => {
    var conn = db.getConnection(); // Get Connection
    conn.connect((err) => {
      // Check Error
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log("Connected!");
      // sql statements
      var sql = `select r.productid,r.userid,u.username,r.rating,r.review,r.created_at from review as r, user as u where r.productid = ? and r.userid = u.userid`;
      conn.query(sql, [id], (err, result) => {
        conn.end();
        // Check Error
        if (err) {
          console.log(err);
          return callback(err, null);
        }
        console.log(result);
        return callback(null, result);
      });
    });
  },
  getReviewByIDwithFilter: (id, filterVal, callback) => {
    var conn = db.getConnection(); // Get Connection
    conn.connect((err) => {
      // Check Error
      console.log(filterVal);
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log("Connected!");
      // sql statements
      if (filterVal != "With") {
        var sql = `select r.productid,r.userid,u.username,r.rating,r.review,r.created_at 
      from review as r, user as u where r.productid = ? and r.userid = u.userid and r.rating = ?`;
        conn.query(sql, [id, filterVal], (err, result) => {
          conn.end();
          // Check Error
          if (err) {
            console.log(err);
            return callback(err, null);
          }
          console.log(result);
          return callback(null, result);
        });
      } else {
        var sql = `select r.productid,r.userid,u.username,r.rating,r.review,r.created_at 
      from review as r, user as u where r.productid = ? and r.userid = u.userid and r.review is not null`;
        conn.query(sql, [id], (err, result) => {
          conn.end();
          // Check Error
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
  updateReview: (id, reviewObj, callback) => {
    var conn = db.getConnection(); // Get Connection
    conn.connect((err) => {
      // Check Error
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      var { userid, rating, review } = reviewObj; // deconstruct reviewObj
      console.log("Connected!");
      // sql statements
      var sql = `update review set rating = ?, review = ? where productid = ? and userid = ?`;
      conn.query(sql, [rating, review, id, userid], (err, result) => {
        conn.end();
        // Check Error
        if (err) {
          console.log(err);
          return callback(err, null);
        }
        console.log(result);
        return callback(null, result);
      });
    });
  },
};

module.exports = reviewDB;
