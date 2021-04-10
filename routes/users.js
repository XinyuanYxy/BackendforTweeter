var express = require('express');
var router = express.Router();
const db = require('../db');

const jwt = require('jsonwebtoken');
// Test secret for development; realistically should be more secure and not stored here
const jwtSecret = 'secretsecretsecret123';

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


//* GET all posts for a specific user */
router.get('/user/:userId', function(req, res, next) {
  let user;
  if (req.params.userId === "me") {
    try {
      user = jwt.decode(req.headers.user.split(" ")[1]).user;
      console.log(`user = ${user}`);
    } catch (e) {
      console.log("Unauthorized user")
      res.status(401).send("UNAUTHORIZED");
    }
  } else {
    user = req.params.userId;
  }
  let sql = `
    SELECT *
    FROM user
    INNER JOIN images ON user.picture_id = images.image_id
    WHERE user.user_id = ?
  `;
  db.query(sql, [user], function(err, result) {
    if (err) {
      console.error(err);
      res.status(500).send("Something went wrong");
    } else {
      res.status(200).send(result);
    }
  });
});

router.post('/', function(req, res, next) {
  const sql = "INSERT INTO user (email, password, username, fname, lname, picture_id) VALUES ?";
  const values = [[
    req.body.email,
    req.body.password,
    req.body.username,
    req.body.firstName,
    req.body.lastName,
    0
  ]];
  db.query(sql, [values], function(err, result) {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        console.log("A user with the requested username already exists");
        res.status(401).send("User already exists");
      } else {
        console.error(err);
        res.status(400).send("Bad Request");
      }
    } else {
      res.status(201).send('SUCCESS');
    }
  });
});

module.exports = router;
