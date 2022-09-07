/*
Name: Soh Hong Yu
Class: DAAA/FT/1B/01
Admin No.: P2100775
*/

var db = require("./databaseConfig");

var productDB = {
  insertProduct: (productObj, product_pic, callback) => {
    var conn = db.getConnection(); // Get Connection
    conn.connect((err) => {
      // Check Error
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log("Connected!");
      var { name, description, categoryid, brand, price } = productObj; //deconstruct productObj
      // sql statements
      var sql = `insert into product (name,description,categoryid,brand,price,product_pic_url) values (?,?,?,?,?,?)`;
      conn.query(
        sql,
        [name, description, categoryid, brand, price, product_pic],
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
  getProductByID: (id, callback) => {
    var conn = db.getConnection(); // Get Connection
    conn.connect((err) => {
      // Check Error
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log("Connected!");
      // sql statements
      var sql = `select p.name,p.product_pic_url, p.description, p.categoryid, c.category as categoryname, p.brand, p.price 
from product as p, category as c where p.id = ? and c.categoryid = p.categoryid;`;
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
  deleteProductByID: (id, callback) => {
    var conn = db.getConnection(); // Get Connection
    conn.connect((err) => {
      // Check Error
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log("Connected!");
      // sql statements
      var sql = `delete from product where id = ?`;
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
  getAllProducts: (callback) => {
    var conn = db.getConnection();
    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log("Connected!");
      var sql = `select p.id, p.name, p.product_pic_url, c.categoryid, c.category, p.description, p.brand, p.price 
      from product as p, category as c where c.categoryid = p.categoryid order by p.id`;
      conn.query(sql, (err, result) => {
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
  search: (searchString, searchByObj, callback) => {
    var conn = db.getConnection();
    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log("Connected!");
      if (searchByObj == "Name")
        var sql = `select * from product where name rlike ?`;
      if (searchByObj == "Brand")
        var sql = `select * from product where brand rlike ?`;
      conn.query(sql, [searchString], (err, result) => {
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
  editProduct: (productID, productObj, product_pic, defaultInfo, callback) => {
    var conn = db.getConnection(); // Get Connection
    conn.connect((err) => {
      // Check Error
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log("Connected!");
      // sql statement
      var sql1 = `select * from product where id = ?`;
      conn.query(sql1, [productID], (err1, result1) => {      
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
        var original_name = result1[0].name;
        var original_description = result1[0].description;
        var original_categoryid = result1[0].categoryid;
        var original_brand = result1[0].brand;
        var original_price = result1[0].price;
        var original_product_pic_url = result1[0].product_pic_url;
        var { name, description, categoryid, brand, price } = productObj;
        if (name == "" || name == undefined) name = original_name;
        if (description == "" || description == undefined)
          description = original_description;
        if (categoryid == "" || categoryid == undefined)
          categoryid = original_categoryid;
        if (brand == "" || brand == undefined) brand = original_brand;
        if (price == "" || price == undefined) price = original_price;
        var product_pic_url = original_product_pic_url;
        if (product_pic != "./img/default_product.png" || defaultInfo) {
          var product_pic_url = product_pic;
        }
        // sql statement
        var sql = `update product set name = ?, description=?,categoryid=?,brand=?, price=?, product_pic_url=? where id = ?`;
        conn.query(
          sql,
          [
            name,
            description,
            categoryid,
            brand,
            price,
            product_pic_url,
            productID,
          ],
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
  getRandom: (callback) => {
    var conn = db.getConnection();
    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log("Connected!");
      var sql = `select p.id,p.name,p.product_pic_url, p.description, p.categoryid, c.category, p.brand, p.price 
from product as p, category as c where c.categoryid = p.categoryid order by rand()`;
      conn.query(sql, [], (err, result) => {
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
  getRandomProductByCategory: (id, callback) => {
    var conn = db.getConnection();
    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log("Connected!");
      var sql = `select p.id, p.name, p.product_pic_url, c.categoryid, c.category, p.description, p.brand, p.price 
      from product as p, category as c where c.categoryid = p.categoryid and p.categoryid = ? order by rand()`;
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

module.exports = productDB;
