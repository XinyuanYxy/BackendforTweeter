var express = require('express');
var router = express.Router();
const db = require('../db');

const jwt = require('jsonwebtoken');
// Test secret for development; realistically should be more secure and not stored here
const jwtSecret = 'secretsecretsecret123';

/* GET posts listing. */
router.get('/', function(req, res, next) {
  let user;
  try {
    user = jwt.decode(req.headers.authorization.split(" ")[1]).user;
  } catch (e) {
    console.log("Unauthorized user")
    res.status(401).send("UNAUTHORIZED");
  }
  // TODO
  let sql = `
    SELECT post.*, poster.username, poster.fname, poster.picture_id AS profile_picture_id
    FROM user AS poster CROSS JOIN post
    RIGHT JOIN following
    WHERE u.user_id = ?
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

router.post('/', function(req, res, next) {
  let user;
  try {
    user = jwt.decode(req.headers.authorization.split(" ")[1]).user;
  } catch (e) {
    console.log("Unauthorized user")
    res.status(401).send("UNAUTHORIZED");
  }
  let sql = "INSERT INTO post (user_id, date, content, picture_id) VALUES ?";
  const values = [[
    user,
    new Date(req.body.date),
    req.body.content || null,
    req.body.picture_id || null,
  ]];
  db.query(sql, [values], function(err, result) {
    if (err) {
        console.error(err);
        res.status(400).send("Bad Request");
    } else {
      const postId = result.insertId;
      sql = `
        SELECT post.*, user.username, user.fname, user.picture_id AS profile_picture_id
        FROM user INNER JOIN post ON user.user_id = post.user_id
        WHERE post.post_id = ?
      `
      db.query(sql, [postId], function(err, result) {
        if (err) {
          console.error(err);
          res.status(500).send("Post was created but something went wrong. Please try refreshing the page");
        } else {
          res.status(201).send(result);
        }
      })
    }
  });
});

module.exports = router;
