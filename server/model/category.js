/*
Name: Soh Hong Yu
Class: DAAA/FT/1B/01
Admin No.: P2100775
*/

var db = require("./databaseConfig");

var categoryDB = {
  insertCategory: (categoryObj, category_pic, callback) => {
    var conn = db.getConnection(); // Get Connection
    conn.connect((err) => {
      // Check Error
      if (err) {
        console.log(err);
        callback(err, null);
        return;
      }
      console.log("Connected!");
      var { category, description } = categoryObj; // deconstruct categoryObj
      // sql statement
      var sql = `insert into category (category,category_pic_url,description) values (?,?,?)`;
      conn.query(sql, [category, category_pic, description], (err, result) => {
        conn.end();
        // Check Error
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
  getAllCategory: (callback) => {
    var conn = db.getConnection(); // Get Connection
    conn.connect((err) => {
      // Check Error
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log("Connected!");
      // sql statement
      var sql = `select * from category`;
      conn.query(sql, (err, result) => {
        conn.end();
        // Check Error
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
  getProductByCategory: (id, callback) => {
    var conn = db.getConnection();
    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log("Connected!");
      var sql = `select p.id, p.name, p.product_pic_url, c.categoryid, c.category, p.description, p.brand, p.price 
      from product as p, category as c where c.categoryid = p.categoryid and p.categoryid = ?`;
      conn.query(sql, [id], (err, result) => {
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
  updateCategory: (
    categoryID,
    categoryObj,
    category_pic,
    defaultInfo,
    callback
  ) => {
    var conn = db.getConnection(); // Get Connection
    conn.connect((err) => {
      // Check Error
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log("Connected!");
      // sql statement
      var sql1 = `select * from category where categoryid = ?`;
      conn.query(sql1, [categoryID], (err1, result1) => {
        if (err1) {
          console.log(err1);
          return callback(err1, null);
        }
        console.log(result1);
        if (result1[0] == undefined) {
          return callback(null, null);
        }
        // if there is no body
        // use old data
        var original_category = result1[0].category;
        var original_description = result1[0].description;
        var original_category_pic_url = result1[0].category_pic_url;
        var { category, description, category_pic_url } = categoryObj;
        if (category == "" || category == undefined)
          category = original_category;
        if (description == "" || description == undefined)
          description = original_description;
        var category_pic_url = original_category_pic_url;
        if (category_pic != "./img/default_category.png" || defaultInfo) {
          var category_pic_url = category_pic;
        }
        // sql statement
        var sql = `update category set category = ?, description=?,category_pic_url=? where categoryid = ?`;
        conn.query(
          sql,
          [category, description, category_pic_url, categoryID],
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
    });
  },
  deleteCategory: (id, callback) => {
    var conn = db.getConnection();
    conn.connect((err) => {
      // Check Error
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log("Connected!");
      var sql = `delete from category where categoryid = ?`;
      conn.query(sql, [id], (err, result) => {
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
};

module.exports = categoryDB;
