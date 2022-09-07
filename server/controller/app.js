/*
Name: Soh Hong Yu
Class: DAAA/FT/1B/01
Admin No.: P2100775
*/

// * Import Libraries and Modules needed
const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config.js");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
var verifyToken = require("../auth/verifyToken.js");
var user = require("../model/user");
var category = require("../model/category");
var product = require("../model/product");
var review = require("../model/review");
var promo = require("../model/promo");
var cart = require("../model/cart");
var image = require("../model/image");
const { error } = require("console");
var app = express();

// * Initialise Middleware
app.use(fileUpload());
app.use(bodyParser.json());
app.use(urlencodedParser);
app.use(cors());

/**
 * @ Table of Content
 * ! Endpoint 1 POST /users/ Create ACC
 * ! Endpoint 2 GET /users/ Dashboard Admin
 * ! Endpoint 3 GET /users/:id/ Profile Page
 * ! Endpoint 4 PUT /users/:id/
 * ! Endpoint 5 POST /category
 * ! Endpoint 6 GET /category
 * ! Endpoint 7 POST /product/
 * ! Endpoint 8 GET /product/:id
 * ! Endpoint 9 DELETE /product/:id/
 * ! Endpoint 10 POST /product/:id/review/
 * ! Endpoint 11 GET /product/:id/reviews
 * ! Endpoint 12 POST /interest/:userid
 * # Advanced Features
 * # Promotion
 * # Cart System
 * # Checkout
 */

// * Endpoint 1 POST /users/
app.post("/users/", (req, res) => {
  var profile_pic = "";
  // Get files from profile_pic_url
  if (req.files !== null && req.files !== undefined) {
    var profileImg = req.files.profile_pic_url;
    profile_pic = image.checkFile(profileImg, req.body.username);
    if (profile_pic == "") {
      console.log("Invalid Image");
      res.status(500).send(`Invalid Image Uploaded`);
      return;
    }
  }
  if (profile_pic == "") {
    profile_pic = "./img/default.png";
  }
  // Run insertUser function
  user.insertUser(req.body, profile_pic, (err, result) => {
    if (err) {
      // Check for Duplicate Entry
      if (err.code === "ER_DUP_ENTRY") {
        res.status(422).send();
        return;
      }
      res.status(500).send(`{
        "Result":"Unexpected Error"
      }`);
      return;
    }
    // Print out userid
    res.status(201).send(`{
      "userid": ${result.insertId}
      }`);
  });
});

// * Endpoint 2 GET /users/
app.get("/users/", (req, res) => {
  // Get all user from user table
  user.getAllUsers((err, result) => {
    if (err) {
      res.status(500).send(`{
        "Result":"Unexpected Error"
      }`);
      return;
    }
    res.status(200).send(`${JSON.stringify(result)}`);
  });
});

// * Endpoint 3 GET /users/:id/
app.get("/users/:id/", (req, res) => {
  // Check params
  var id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(500).send("Invalid ID");
    return;
  }
  // Run getUserByID function
  user.getUserByID(id, (err, result) => {
    if (err) {
      res.status(500).send(`{
        "Result":"Unexpected Error"
      }`);
      return;
    }
    res.status(200).send(result[0]);
  });
});

// * Endpoint 4 PUT /users/:id/
app.put("/users/:id/", (req, res) => {
  // Check params
  var id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(500).send("Invalid ID");
    return;
  }
  var profile_pic = "";
  // Check files uploaded
  console.log(req.files);
  if (req.files !== null && req.files !== undefined) {
    var profileImg = req.files.profile_pic_url;
    profile_pic = image.checkFile(profileImg, req.body.username);
    if (profile_pic == "") {
      console.log("Invalid Image");
      res.status(500).send("Invalid Image");
      return;
    }
  }
  if (profile_pic == "") {
    profile_pic = "./img/default.png";
  }
  var defaultInfo = false;
  if (req.files == null && req.body.profile_pic_url == "") {
    defaultInfo = true;
  }
  // Run updateUser function
  user.updateUser(id, req.body, profile_pic, defaultInfo, (err, result) => {
    if (err) {
      // Check for duplicate entry
      if (err.code === "ER_DUP_ENTRY") {
        res.send(422).send();
        return;
      }
      res.status(500).send(`{
        "Result":"Unexpected Error"
      }`);
      return;
    }
    // Check for invalid user id to update
    if (result === null) {
      res.status(500).send(`Invalid User ID`);
      return;
    }
    res.status(204).send();
  });
});

// * Endpoint 5 POST /category
app.post("/category", (req, res) => {
  var category_pic = "";
  // Check category_pic uploaded
  if (req.files !== null) {
    var categoryImg = req.files.category_pic_url;
    category_pic = image.checkFile(categoryImg, req.body.category);
    if (category_pic == "") {
      console.log("Invalid Image");
      res.status(500).send("Invalid Image Uploaded");
      return;
    }
  }
  // If invalid file, default Image
  if (category_pic == "") {
    category_pic = "./img/default_category.png";
  }
  // Run insertCategory function
  category.insertCategory(req.body, category_pic, (err, result) => {
    if (err) {
      // Check for Duplicate Entry
      if (err.code === "ER_DUP_ENTRY") {
        res.send(422).send();
        return;
      }
      res.send(500).send(`{
        "Result":"Unexpected Error"
      }`);
      return;
    }
    res.status(204).send();
  });
});

// * Endpoint 6 GET /category
app.get("/category", (req, res) => {
  // Get all category
  category.getAllCategory((err, result) => {
    if (err) {
      res.status(500).send(`{
        "Result":"Unexpected Error"
      }`);
      return;
    }
    res.status(200).send(`${JSON.stringify(result)}`);
    return;
  });
});

app.get("/category/:id", (req, res) => {
  // Check params
  var id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(500).send("Invalid ID");
    return;
  }
  category.getProductByCategory(id, (err, result) => {
    if (err) {
      res.status(500).send();
      return;
    }
    res.status(200).send(result);
    return;
  });
});

app.put("/category/:id", verifyToken, (req, res) => {
  // Check params
  var id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(500).send("Invalid ID");
    return;
  }
  if (req.decodedToken.type != "Admin") {
    return;
  }
  var category_pic = "";
  // Check category_pic uploaded
  if (req.files !== null && req.files !== undefined) {
    var categoryImg = req.files.category_pic_url;
    category_pic = image.checkFile(categoryImg, req.body.category);
    if (category_pic == "") {
      console.log("Invalid Image");
      res.status(500).send("Invalid Image Uploaded");
      return;
    }
  }
  // If invalid file, default Image
  if (category_pic == "") {
    category_pic = "./img/default_category.png";
  }
  var defaultInfo = false;
  if (req.files == null && req.body.category_pic_url == "") {
    defaultInfo = true;
  }
  category.updateCategory(
    id,
    req.body,
    category_pic,
    defaultInfo,
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          res.send(422).send();
          return;
        }
        res.status(500).send(`{
        "Result":"Unexpected Error"
      }`);
        return;
      }
      res.status(200).send(result);
    }
  );
});

app.delete("/category/:id", verifyToken, (req, res) => {
  if (req.decodedToken.type != "Admin") {
    return;
  }
  var id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(500).send("Invalid ID");
    return;
  }
  category.deleteCategory(id, (err, result) => {
    if (err) {
      res.status(500).send();
      return;
    }
    res.status(204).send();
    return;
  });
});

// * Endpoint 7 POST /product/
app.post("/product/", verifyToken, (req, res) => {
  if (req.decodedToken.type != "Admin") {
    return;
  }
  var product_pic = "";
  // Check product_pic uploaded
  if (req.files !== null) {
    var productImg = req.files.product_pic_url;
    product_pic = image.checkFile(productImg, req.body.name);
    if (product_pic == "") {
      console.log("Invalid Image");
      res.status(500).send("Invalid Image Uploaded");
      return;
    }
  }
  // If invalid file, default Image
  if (product_pic == "") {
    product_pic = "./img/default_product.png";
  }
  // Run insertProduct function
  product.insertProduct(req.body, product_pic, (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        res.status(422).send();
        return;
      }
      res.status(500).send(`{
        "Result":"Unexpected Error"
      }`);
      return;
    }
    res.status(201).send(`{
    "productid": ${result.insertId}
} `);
    return;
  });
});

app.put("/product/:id", verifyToken, (req, res) => {
  // Check params
  var id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(500).send("Invalid ID");
    return;
  }
  if (req.decodedToken.type != "Admin") {
    return;
  }
  var product_pic = "";
  console.log(req.files);
  // Check product_pic uploaded
  if (req.files !== null && req.files !== undefined) {
    var productImg = req.files.product_pic_url;
    product_pic = image.checkFile(productImg, req.body.name);
    if (product_pic == "") {
      console.log("Invalid Image");
      res.status(500).send("Invalid Image Uploaded");
      return;
    }
  }
  // If invalid file, default Image
  if (product_pic == "") {
    product_pic = "./img/default_product.png";
  }
  var defaultInfo = false;
  if (req.files == null && req.body.product_pic_url == "") {
    defaultInfo = true;
  }
  product.editProduct(id, req.body, product_pic, defaultInfo, (err, result) => {
    if (err) {
      if (err.code == "ER_DUP_ENTRY") {
        res.status(422).send();
        return;
      }
      res.status(500).send(`{
        "Result":"Unexpected Error"
      }`);
      return;
    }
    res.status(200).send(result);
  });
});

// * Endpoint 8 GET /product/:id
app.get("/product/:id", (req, res) => {
  // Check params
  var id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(500).send("Invalid ID");
    return;
  }
  // Run getProductByID function
  product.getProductByID(id, (err, result) => {
    if (err) {
      res.status(500).send(`{
        "Result":"Unexpected Error"
      }`);
      return;
    }
    // If there is no result, return empty instead empty array
    if (result.length == 0) {
      return res.status(200).send();
    }
    // Make all prices 2 dp
    result[0].price = String(result[0].price.toFixed(2));
    res.status(200).send(`${JSON.stringify(result[0])}`);
    return;
  });
});

// * Endpoint 9 DELETE /product/:id/
app.delete("/product/:id/", verifyToken, (req, res) => {
  if (req.decodedToken.type != "Admin") {
    return;
  }
  // Check params
  var id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(500).send("Invalid ID");
    return;
  }
  // Run deleteProductByID function
  product.deleteProductByID(id, (err, result) => {
    if (err) {
      res.status(500).send(`{
        "Result":"Unexpected Error"
      }`);
      return;
    }
    res.status(204).send();
  });
});

// * Endpoint 10 POST /product/:id/review/
app.post("/product/:id/review/", verifyToken, (req, res) => {
  if (!req.decodedToken.type) {
    return;
  }
  // Check params
  var id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(500).send("Invalid");
    return;
  }
  // Run addReview function
  review.addReview(id, req.body, (err, result) => {
    if (err) {
      res.status(500).send(`{
        "Result":"Unexpected Error"
      }`);
      return;
    }
    res.status(201).send(`{
      "reviewid": ${result.insertId}
    }`);
  });
});

// * Endpoint 11 GET /product/:id/reviews
app.get("/product/:id/reviews", (req, res) => {
  // Check params
  var id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(500).send("Invalid ID");
    return;
  }
  // Run getReviewByID function
  review.getReviewByID(id, (err, result) => {
    if (err) {
      res.status(500).send(`{
        "Result":"Unexpected Error"
      }`);
      return;
    }
    res.status(200).send(`${JSON.stringify(result)}`);
  });
});

// * Endpoint 12 POST /interest/:userid
app.post("/interest/:userid", verifyToken, (req, res) => {
  var userid = parseInt(req.params.userid);
  // Check params
  if (isNaN(userid)) {
    res.status(500).send("Invalid ID");
    return;
  }
  if (userid != req.decodedToken.userid) {
    res.status(401).send();
    return;
  }
  // Run addInterest function
  user.addInterest(userid, req.body, (err, result) => {
    if (err) {
      res.status(500).send(`{
        "Result":"Unexpected Error"
      }`);
      return;
    }
    res.status(201).send();
    return;
  });
});

app.delete("/interest/:userid", verifyToken, (req, res) => {
  var userid = parseInt(req.params.userid);
  // Check params
  if (isNaN(userid)) {
    res.status(500).send("Invalid ID");
    return;
  }
  if (userid != req.decodedToken.userid) {
    res.status(401).send();
    return;
  }
  // Run deleteInterest function
  user.deleteInterest(userid, req.body, (err, result) => {
    if (err) {
      res.status(500).send(`{
        "Result":"Unexpected Error"
      }`);
      return;
    }
    res.status(201).send();
    return;
  });
});

app.get("/interest/:userid", (req, res) => {
  var userid = parseInt(req.params.userid);
  // Check params
  if (isNaN(userid)) {
    res.status(500).send("Invalid ID");
    return;
  }
  user.getInterest(userid, (err, result) => {
    if (err) {
      res.status(500).send();
      return;
    }
    res.status(200).send(result);
  });
});

// ! Advance Features
/*
• Promotion
• Cart System
• Checkout
*/

// # Promotion
// * POST New Promo
app.post("/product/:id/promo", verifyToken, (req, res) => {
  if (req.decodedToken.type != "Admin") {
    return;
  }
  var promo_pic = "";
  // Check category_pic uploaded
  if (req.files !== null) {
    var promoImg = req.files.promo_pic_url;
    promo_pic = image.checkFile(promoImg, req.body.promoName);
    if (promo_pic == "") {
      console.log("Invalid Image");
      res.status(500).send("Invalid Image Uploaded");
      return;
    }
  }
  // If invalid file, default Image
  if (promo_pic == "") {
    promo_pic = "./img/CNY.png";
  }
  // Check params
  var id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(500).send(`Invalid id`);
    return;
  }
  // Run insertPromo function
  promo.insertPromo(id, req.body, promo_pic, (err, result) => {
    if (err) {
      return res.status(500).send(`{
        "Result":"Unexpected Error"
      }`);
    }
    // Check if result is a string
    if (typeof result == "string") {
      return res.status(400).send(result);
    } else if (result == null) {
      // Check for Dup
      return res.status(422).send();
    }
    res.status(201).send(`{
      "promoId" : ${result.insertId}
    }`);
  });
});

// * GET All Promo
app.get("/promo", (req, res) => {
  // Run getAllPromo function
  promo.getAllPromo((err, result) => {
    if (err) {
      res.status(500).send(`{
        "Result":"Unexpected Error"
      }`);
      return;
    }
    res.status(200).send(result);
  });
});

// * Get Promo by product
app.get("/product/:id/promo", (req, res) => {
  // Check params
  var id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(500).send("Invalid ID");
    return;
  }
  // Run getPromoByID function
  promo.getPromoByID(id, (err, result) => {
    if (err) {
      res.status(500).send(`{
        "Result":"Unexpected Error"
      }`);
      return;
    }
    res.status(200).send(result);
  });
});

// * Delete Promo
app.delete("/promo/:id", verifyToken, (req, res) => {
  if (req.decodedToken.type != "Admin") {
    return;
  }
  // Check params
  var id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(500).send("Invalid ID");
    return;
  }
  // Run deletePromo function
  promo.deletePromo(id, (err, result) => {
    if (err) {
      res.status(500).send(`{
        "Result":"Unexpected Error"
      }`);
      return;
    }
    res.status(204).send();
  });
});

app.put("/promo/:id", verifyToken, (req, res) => {
  if (req.decodedToken.type != "Admin") {
    return;
  }
  var promo_pic = "";
  // Check category_pic uploaded
  if (req.files !== null && req.files !== undefined) {
    var promoImg = req.files.promo_pic_url;
    promo_pic = image.checkFile(
      promoImg,
      req.body.promoName + "_" + req.body.productid
    );
    if (promo_pic == "") {
      console.log("Invalid Image");
      res.status(500).send("Invalid Image Uploaded");
      return;
    }
  }
  // If invalid file, default Image
  if (promo_pic == "") {
    promo_pic = "./img/CNY.png";
  }
  // Check params
  var id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(500).send(`Invalid id`);
    return;
  }
  var defaultInfo = false;
  if (req.files == null && req.body.promo_pic_url == "") {
    defaultInfo = true;
  }
  promo.updatePromo(id, req.body, promo_pic, defaultInfo, (err, result) => {
    if (err) {
      res.status(500).send(`{
        "Result":"Unexpected Error"
      }`);
      return;
    }
    // Check if result is a string
    if (typeof result == "string") {
      return res.status(400).send(result);
    }
    res.status(200).send(result);
  });
});

// # Cart System
// * Add item to Cart
app.post("/product/:id/cart/:userid", verifyToken, (req, res) => {
  // Check params
  var productid = parseInt(req.params.id);
  var userid = parseInt(req.params.userid);
  if (isNaN(userid) || isNaN(productid)) {
    res.status(500).send("Invalid IDs");
    return;
  }
  if (userid != req.decodedToken.userid) {
    return res.status(401).send();
  }
  // Run addCart function
  cart.addCart(productid, userid, req.body, (err, result) => {
    if (err) {
      res.status(500).send(`{
        "Result":"Unexpected Error"
      }`);
      return;
    }
    if (result == null) {
      res.status(500).send(`Invalid Quantity`);
      return;
    }
    res.status(201).send(`Added to cart: 
    {
      "cartId":${result[0].id},
      "product": "${result[0].name}",
      "quantity":${result[0].quantity}
    }`);
  });
});

app.put("/cart/:cartId", verifyToken, (req, res) => {
  // Check params
  var cartId = parseInt(req.params.cartId);
  var userid = parseInt(req.body.userid);
  var qty = parseInt(req.body.quantity);
  if (isNaN(cartId) || isNaN(qty) || isNaN(userid)) {
    res.status(500).send("Invalid IDs");
    return;
  }
  if (userid != req.decodedToken.userid) {
    res.status(401).send();
    return;
  }
  cart.updateCart(cartId, qty, (err, result) => {
    if (err) {
      res.status(500).send(`{
        "Result":"Unexpected Error"
      }`);
      return;
    }
    res.status(204).send(result);
  });
});

// * DELETE/UPDATE items in cart
app.delete("/cart/:cartId", verifyToken, (req, res) => {
  // Check params
  var cartId = parseInt(req.params.cartId);
  var userid = parseInt(req.body.userid);
  if (isNaN(cartId) || isNaN(userid)) {
    res.status(500).send("Invalid Cart ID or Invalid UserID");
    return;
  }
  if (userid != req.decodedToken.userid) {
    res.status(401).send();
    return;
  }
  // Run removeCart function
  cart.removeCart(cartId, (err, result) => {
    if (err) {
      res.status(500).send(`{
        "Result":"Unexpected Error"
      }`);
      return;
    }
    res.status(204).send();
    return;
  });
});

// * Get user's cart
app.get("/cart/:userid", verifyToken, (req, res) => {
  // Check params
  var userid = parseInt(req.params.userid);
  if (isNaN(userid)) {
    res.status(500).send("Invalid ID");
    return;
  }
  if (userid != req.decodedToken.userid) {
    res.status(401).send();
    return;
  }
  // Run getCart function
  cart.getCart(userid, (err, result) => {
    if (err) {
      res.status(500).send();
      return;
    }
    res.status(200).send(result);
  });
});

// # Checkout
// * Checkout
app.post("/:userid/checkout", verifyToken, (req, res) => {
  // Check params
  var userid = parseInt(req.params.userid);
  if (isNaN(userid)) {
    res.status(500).send("Invalid ID");
    return;
  }
  if (userid != req.decodedToken.userid) {
    res.status(401).send();
    return;
  }
  // run checkOutCart function
  cart.checkOutCart(userid, req.body, (err, result) => {
    if (err) {
      res.status(500).send(`{
        "Result":"Unexpected Error"
      }`);
      return;
    }
    res.status(200).send();
  });
});

// Login
app.post("/login", (req, res) => {
  user.login(req.body, (err, result) => {
    if (err) {
      return res.status(500).send("Error");
    }
    if (!result.length) {
      return res.status(404).send();
    }
    const payload = { userid: result[0].userid, type: result[0].type };
    jwt.sign(
      payload,
      JWT_SECRET,
      { algorithm: "HS256", expiresIn: 86400 },
      (error, token) => {
        if (error) {
          console.log(error);
          res.status(401).send();
          return;
        }
        res.status(200).send({
          token: token,
          userid: result[0].userid,
          type: result[0].type,
        });
      }
    );
  });
});

// Get Image
app.get("/img/:imgFileName", (req, res) => {
  var fileName = req.params.imgFileName;
  // res.send(fileName);
  fs.exists(`./img/${fileName}`, function (exists) {
    if (!exists) {
      res.writeHead(404, {
        "Content-Type": "text/plain",
      });
      res.end("404 Not Found");
      return;
    } // Extracting file extension
    var ext = fileName.split(".").pop();

    // Setting default Content-Type
    var contentType = "text/plain";

    // Checking if the extension of
    // image is '.png'
    if (ext === "png") {
      contentType = "image/png";
    } else if (ext === "jpg" || ext === "jpeg") {
      contentType = "image/jpeg";
    }

    // Setting the headers
    res.writeHead(200, {
      "Content-Type": contentType,
    });

    // Reading the file
    fs.readFile(`./img/${fileName}`, function (err, content) {
      // Serving the image
      res.end(content);
    });
  });
});

// Get products
app.get("/products", (req, res) => {
  product.getAllProducts((err, result) => {
    if (err) {
      res.status(500).send();
      return;
    }
    res.status(200).send(result);
    return;
  });
});

app.get("/product/:id/reviews/:filter1", (req, res) => {
  // Check params
  var id = parseInt(req.params.id);
  var filter1 = req.params.filter1;
  if (isNaN(id)) {
    res.status(500).send("Invalid ID or Filter");
    return;
  }
  review.getReviewByIDwithFilter(id, filter1, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send(result);
  });
});

app.put("/product/:id/review/", verifyToken, (req, res) => {
  if (!req.decodedToken.type) {
    return;
  }
  // Check params
  var id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(500).send("Invalid");
    return;
  }
  // Run addReview function
  review.updateReview(id, req.body, (err, result) => {
    if (err) {
      res.status(500).send(`{
        "Result":"Unexpected Error"
      }`);
      return;
    }
    res.status(204).send();
  });
});

app.get("/search/:searchSelector/:searchValue", (req, res) => {
  var searchValue = req.params.searchValue;
  var searchSelector = req.params.searchSelector;
  product.search(searchValue, searchSelector, (err, result) => {
    if (err) {
      return res.status(404).send();
    }
    return res.status(200).send(result);
  });
});

app.get("/pastCart/:userid", (req, res) => {
  // Check params
  var userid = parseInt(req.params.userid);
  if (isNaN(userid)) {
    res.status(500).send("Invalid ID");
    return;
  }
  cart.getPastCart(userid, (err, result) => {
    if (err) {
      return res.status(500).send();
    }
    return res.status(200).send(result);
  });
});

app.get("/random", (req, res) => {
  product.getRandom((err, result) => {
    if (err) {
      return res.status(500).send();
    }
    return res.status(200).send(result);
  });
});

app.get("/random/:categoryid", (req, res) => {
  var categoryid = parseInt(req.params.categoryid);
  if (isNaN(categoryid)) {
    res.status(500).send("Invalid ID");
    return;
  }
  product.getRandomProductByCategory(categoryid, (err, result) => {
    if (err) {
      return res.status(500).send();
    }
    return res.status(200).send(result);
  });
});

module.exports = app;
