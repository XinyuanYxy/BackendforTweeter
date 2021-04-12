var express = require('express');
var router = express.Router();
const db = require('../db');

const jwt = require('jsonwebtoken');
const { render } = require('jade');
// Test secret for development; realistically should be more secure and not stored here
const jwtSecret = 'secretsecretsecret123';

router.get('/user/:userId', function(req, res, next) {
  let user;
  try {
    user = jwt.decode(req.headers.authorization.split(" ")[1]).user;
  } catch (e) {
    console.log("Unauthorized user")
    res.status(401).send("UNAUTHORIZED");
  }

  let sql = `
    SELECT username
    FROM user 
    INNER JOIN following ON user.user_id = following.following_id
    WHERE following.user_id = ? AND following.following_id = ?
  `;
  const values = [
    user,
    req.params.userId
  ];
  console.log("USER: " + user + "FOLLOWING: " + values[1]);
  db.query(sql, values, function(err, result) {
    if (err) {
      console.error(err);
      res.status(500).send("Something went wrong");
    } else {
      res.status(200).send(result);
    }
  });
});

router.post('/:followId', function(req, res, next) {
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
    req.params.followId
  ]];

  db.query(sql, [values], function(err, result) { 
    if (err) {
        console.error(err);
        res.status(400).send("Bad Request");
    } else {
      res.status(200).send("SUCCESS");
    }
  });
})

router.delete('/unfollow/:unfollowId', function(req, res, next) {
    let user;
    try {
      user = jwt.decode(req.headers.authorization.split(" ")[1]).user;
    } catch (e) {
      console.log("Unauthorized user")
      res.status(401).send("UNAUTHORIZED");
    }
    let sql = "DELETE FROM following WHERE user_id = ? AND following_id = ?";
    db.query(sql, [user, req.params.unfollowId], function(err, result) { 
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
