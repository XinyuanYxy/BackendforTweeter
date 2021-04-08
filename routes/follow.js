var express = require('express');
var router = express.Router();
const db = require('../db');

const jwt = require('jsonwebtoken');
// Test secret for development; realistically should be more secure and not stored here
const jwtSecret = 'secretsecretsecret123';

router.post('/', function(req, res, next) {
  let user;
  try {
    user = jwt.decode(req.headers.authorization.split(" ")[1]).user;
  } catch (e) {
    console.log("Unauthorized user")
    res.status(401).send("UNAUTHORIZED");
  }
  let sql = "INSERT INTO following (user_id, following_id) VALUES ?";
  const values = [[
    user,
    req.body.following_id
  ]];
  db.query(sql, [values], function(err, result) {
    if (err) {
        console.error(err);
        res.status(400).send("Bad Request");
    } else {
      res.status(201).send("SUCCESS");
    }
  });
});

router.delete('/:id', function(req, res, next) {
    let user;
    try {
      user = jwt.decode(req.headers.authorization.split(" ")[1]).user;
    } catch (e) {
      console.log("Unauthorized user")
      res.status(401).send("UNAUTHORIZED");
    }
    let sql = "DELETE FROM following WHERE user_id = ? AND following_id = ?";
    db.query(sql, [user, req.params.id], function(err, result) { 
      if (err) {
          console.error(err);
          res.status(400).send("Bad Request");
      } else {
        if (result.affectedRows === 0) {
          console.log("No following entry to delete");
        } else {
          console.log("Following entry deleted");
        }
        res.status(200).send("SUCCESS");
      }
    });
})

module.exports = router;
