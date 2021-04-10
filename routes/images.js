var express = require('express');
var router = express.Router();
const db = require('../db');

const jwt = require('jsonwebtoken');
// Test secret for development; realistically should be more secure and not stored here
const jwtSecret = 'secretsecretsecret123';

router.get('/', function(req, res, next) {
  let user;
  try {
    user = jwt.decode(req.headers.authorization.split(" ")[1]).user;
    console.log(`user = ${user}`);
  } catch (e) {
    console.log("Unauthorized user")
    res.status(401).send("UNAUTHORIZED");
  }
  let sql = `
    SELECT post.*, poster.username, poster.fname, poster.picture_id AS profile_picture_id
    FROM user AS poster INNER JOIN post on poster.user_id = post.user_id
    INNER JOIN following ON post.user_id = following.following_id
    WHERE following.user_id = ?
    ORDER BY post.date
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

module.exports = router;
