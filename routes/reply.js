var express = require('express');
var router = express.Router();
const db = require('../db');

const jwt = require('jsonwebtoken');
// Test secret for development; realistically should be more secure and not stored here
const jwtSecret = 'secretsecretsecret123';


/* GET all replies for a specific post */
router.get('/post/:postId', function(req, res, next) {
  let post_id = req.params.postId;

  console.log(`post_id = ${post_id}`);

  let sql = `
    SELECT reply.*, reply_image.image_path AS reply_image_path, poster.username, poster.fname, avatar_image.image_path AS avatar_image_path
    FROM user AS poster INNER JOIN reply on poster.user_id = reply.user_id
    LEFT OUTER JOIN images AS avatar_image ON poster.picture_id = avatar_image.image_id
    LEFT OUTER JOIN images AS reply_image ON reply.picture_id = reply_image.image_id
    WHERE reply.post_id = ?
    ORDER BY reply.date ASC, reply.reply_id
  `;
  db.query(sql, [post_id], function(err, result) {
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
  let sql = "INSERT INTO reply (user_id, post_id, date, content, picture_id) VALUES ?";
  const values = [[
    user,
    req.body.post_id,
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
