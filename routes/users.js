var express = require('express');
var router = express.Router();
const db = require('../db');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function(req, res, next) {
  const sql = "INSERT INTO user (email, password, fname, lname, picture_id) VALUES ?";
  const values = [[
    req.body.username,
    req.body.password,
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
