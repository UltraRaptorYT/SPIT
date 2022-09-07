/*
Name: Soh Hong Yu
Class: DAAA/FT/1B/01
Admin No.: P2100775
*/

var db = require("./databaseConfig");

var cartDB = {
  addCart: (productid, userid, qtyObj, callback) => {
    // get quantity
    var qty = parseInt(qtyObj.quantity);
    if (qty <= 0) {
      // check if qty is <= 0
      return callback(null, null);
    }
    var conn = db.getConnection(); // Get Connection
    conn.connect((err) => {
      // Check Error
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log("Connected!");
      // sql statements
      var sql1 = `select * from cart where userid = ? and productid =?`;
      var insertSQL = `insert into cart (userid,productid,quantity) values(?,?,?)`;
      var updateSQL = `update cart set quantity = ? where productid = ? and userid = ?`;
      conn.query(sql1, [userid, productid], (err, result) => {
        // Check Error
        if (err) {
          console.log(err);
          return callback(err, null);
        }
        console.log(result);
        // If cart items doesn't exist
        if (result.length == 0) {
          conn.query(insertSQL, [userid, productid, qty], (err, result) => {
            // Check Error
            if (err) {
              console.log(err);
              return callback(err, null);
            }
            console.log(result);
          });
        } else {
          // Increment if item already exist
          qty += result[0].quantity;
          conn.query(updateSQL, [qty, productid, userid], (err, result) => {
            // Check Error
            if (err) {
              console.log(err);
              return callback(err, null);
            }
            console.log(result);
          });
        }
        // Get statement to get result info
        var sql = `select c.id,p.name,c.quantity from cart as c, product as p where c.userid=? and c.productid = ? and c.productid = p.id`;
        conn.query(sql, [userid, productid], (err, result) => {
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
    });
  },
  getCart: (userid, callback) => {
    var conn = db.getConnection(); // Get Connection
    conn.connect((err) => {
      // Check Error
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log("Connected!");
      // sql statement
      var sql = `select c.id,p.id as productid, p.name,c.quantity from cart as c, product as p where c.userid = ? and c.productid = p.id`;
      conn.query(sql, [userid], (err, result) => {
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
  updateCart: (cartId, qty, callback) => {
    var conn = db.getConnection(); // Get Connection
    conn.connect((err) => {
      // Check Error
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log("Connected!");
      var sql = `update cart set quantity = ? where id = ?`;
      conn.query(sql, [qty, cartId], (err, result) => {
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
  removeCart: (cartId, callback) => {
    var conn = db.getConnection(); // Get Connection
    conn.connect((err) => {
      // Check Error
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log("Connected!");
      var sql = `delete from cart where id = ?`;
      conn.query(sql, [cartId], (err, result) => {
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
  checkOutCart: (userid, cartInfoObj, callback) => {
    var conn = db.getConnection(); // Get Connection
    conn.connect(async (err) => {
      // Check Error
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log("Connected!");
      // sql statement
      var sql = `insert into checkout_history (orderNo,userid,productid,quantity,price,discount_price) values (?,?,?,?,?,?)`;
      for await (const item of cartInfoObj.productArr) {
        console.log(item);
        conn.query(
          sql,
          [
            cartInfoObj.orderNo,
            userid,
            item,
            cartInfoObj.quantityArr[cartInfoObj.productArr.indexOf(item)],
            cartInfoObj.priceArr[cartInfoObj.productArr.indexOf(item)],
            cartInfoObj.discountPriceArr[cartInfoObj.productArr.indexOf(item)],
          ],
          (err, result) => {
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
  getPastCart: (userid, callback) => {
    var conn = db.getConnection(); // Get Connection
    conn.connect(async (err) => {
      // Check Error
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log("Connected!");
      // sql statement
      var sql = `select * from checkout_history where userid = ? order by created_at desc`;
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
};

module.exports = cartDB;
