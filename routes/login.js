const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

// Test secret for development; realistically should be more secure and not stored here
const jwtSecret = 'secretsecretsecret123';
// Determines how long until the auth token should expire
const expiresIn = 60;

/* POST login */
router.post('/', function(req, res, next) {
  console.log(req.body);
  const sql = "SELECT * FROM user WHERE email = ?"
  db.query(sql, [req.body.username], function (err, result) {
    if (err) throw err;
    if (result.length === 0) {
      console.log("user does not exist");
      res.status(401).send("UNAUTHORIZED");
    } else {
      if (result[0].password === req.body.password) {
        res.status(200).send({
          token: jwt.sign({ user: result[0].user_id }, jwtSecret, { expiresIn })
        });
      } else {
        console.log("incorrect password");
        res.status(401).send("UNAUTHORIZED");
      }
    }
  });
});

module.exports = router;
