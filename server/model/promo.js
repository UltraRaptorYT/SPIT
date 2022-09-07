/*
Name: Soh Hong Yu
Class: DAAA/FT/1B/01
Admin No.: P2100775
*/

var db = require("./databaseConfig");

var promoDB = {
  insertPromo: (id, promoObj, promo_pic, callback) => {
    var conn = db.getConnection(); // Get Connection
    conn.connect((err) => {
      // Check Error
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log("Connected!");
      var { promoName, promoDescription, startPromo, endPromo, discount } =
        promoObj;
      var startDate = new Date(startPromo);
      var endDate = new Date(endPromo);
      if (endDate < startDate) {
        console.log("Date makes no sense"); // Make sure date is valid
        return callback(null, "Invalid Date");
      }
      // insert if and only if promotion does not already exist
      // sql statement
      var sql = `insert into promo (productid,promoName,promoDescription,promo_pic_url,startPromo,endPromo,discount)
        select * from (select ? as productid, ? as promoName, ? as promoDescription, 
          ? as promo_pic_url, ? as startPromo,? as endPromo, ? as discount) as tmp
        where not exists (select * from promo where productid = ? and startPromo = ? and endPromo = ?)`;
      conn.query(
        sql,
        [
          id,
          promoName,
          promoDescription,
          promo_pic,
          startPromo,
          endPromo,
          discount,
          id,
          startPromo,
          endPromo,
        ],
        (err, result) => {
          conn.end();
          // Check Error
          if (err) {
            console.log(err);
            return callback(err, null);
          }
          // Check for duplicated promo
          if (result.affectedRows == 0) {
            console.log("Duplicated Promo");
            return callback(null, null);
          }
          console.log(result);
          return callback(null, result);
        }
      );
    });
  },
  getAllPromo: (callback) => {
    var conn = db.getConnection(); // Get Connection
    conn.connect((err) => {
      // Check Error
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log("Connected!");
      // sql statement
      var sql = `select * from promo order by startPromo desc, endPromo desc`;
      conn.query(sql, (err, result) => {
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
  getPromoByID: (id, callback) => {
    var conn = db.getConnection(); // Get Connection
    conn.connect((err) => {
      // Check Error
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log("Connected!");
      // sql statement
      var sql = `select * from promo where productid = ? order by startPromo`;
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
  deletePromo: (id, callback) => {
    var conn = db.getConnection(); // Get Connection
    conn.connect((err) => {
      // Check Error
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log("Connected!");
      // sql statement
      var sql = `DELETE FROM promo WHERE id = ?`;
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
  updatePromo: (promoID, promoObj, promo_pic, defaultInfo, callback) => {
    var conn = db.getConnection();
    conn.connect((err) => {
      // Check Error
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log("Connected!");
      // sql statement
      var sql1 = `select * from promo where id = ?`;
      conn.query(sql1, [promoID], (err1, result1) => {
        if (err1) {
          console.log(err1);
          return callback(err1, null);
        }
        if (result1[0] == undefined) {
          return callback(null, null);
        }
        // if there is no body
        // use old data
        var original_productid = result1[0].productid;
        var original_promoName = result1[0].promoName;
        var original_promoDescription = result1[0].promoDescription;
        var original_startPromo = result1[0].startPromo;
        var original_endPromo = result1[0].endPromo;
        var original_discount = result1[0].discount;
        var original_promo_pic_url = result1[0].promo_pic_url;
        var {
          productid,
          promoName,
          promoDescription,
          startPromo,
          endPromo,
          discount,
        } = promoObj;
        if (promoName == "" || promoName == undefined)
          promoName = original_promoName;
        if (promoDescription == "" || promoDescription == undefined)
          promoDescription = original_promoDescription;
        if (startPromo == "" || startPromo == undefined)
          startPromo = original_startPromo;
        if (endPromo == "" || endPromo == undefined)
          endPromo = original_endPromo;
        if (discount == "" || discount == undefined)
          discount = original_discount;
        if (productid == "" || productid == undefined)
          productid = original_productid;
        var promo_pic_url = original_promo_pic_url;
        if (promo_pic != "./img/CNY.png" || defaultInfo) {
          var promo_pic_url = promo_pic;
        }
        var startDate = new Date(startPromo);
        var endDate = new Date(endPromo);
        if (endDate < startDate) {
          console.log("Date makes no sense"); // Make sure date is valid
          return callback(null, "Invalid Date");
        }
        // sql statement
        var sql = `update promo set productid = ?, promoName = ?, 
        promoDescription = ?,startPromo = ?,endPromo = ?, discount=?, promo_pic_url = ?
        where id = ?`;
        conn.query(
          sql,
          [
            productid,
            promoName,
            promoDescription,
            startPromo,
            endPromo,
            discount,
            promo_pic_url,
            promoID,
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
};

module.exports = promoDB;
