/*
Name: Soh Hong Yu
Class: DAAA/FT/1B/01
Admin No.: P2100775
*/

var jwt = require("jsonwebtoken");

var JWT_SECRET = require("../config");

var verifyToken = (req, res, next) => {
  var token = req.headers["authorization"]; //retrieve authorization header's content
  console.log(token);
  if (!token || !token.includes("Bearer")) {
    //process the token
    res.status(403);
    return res.send({ auth: "false", message: "Not authorized!" });
  } else {
    token = token.split("Bearer ")[1]; //obtain the token's value
    jwt.verify(
      token,
      JWT_SECRET,
      { algorithms: ["HS256"] },
      function (err, decoded) {
        //verify token
        if (err) {
          res.status(401);
          return res.end({ auth: false, message: "Not authorized!" });
        } else {
          req.decodedToken = decoded;
          console.log(req.decodedToken);
          next();
        }
      }
    );
  }
};

module.exports = verifyToken;
