var express = require('express');
var router = express.Router();
const db = require('../db');

const jwt = require('jsonwebtoken');
// Test secret for development; realistically should be more secure and not stored here
const jwtSecret = 'secretsecretsecret123';
const multer = require("multer");
const upload = multer({ dest: "public/images/" })  

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

router.post("/", upload.single("file"), function(req, res, next) {
  let sql = `INSERT INTO images (image_path) VALUES ?`
  const path = `${req.file.filename}`
  const values = [[path]];
  db.query(sql, [values], function(err, result) {
    if (err) {
      console.error(err);
      res.status(500).send("Something went wrong");
    } else {
      console.log(result.insertId);
      res.status(201).send({ picture_id: result.insertId }); 
    }
  });
});

router.post("/profile", upload.single("file"), function(req, res, next) {
  let sql = `INSERT INTO images (image_path) VALUES ?`
  const path = `${req.file.filename}`
  const values = [[path]];
  db.query(sql, [values], function(err, result) {
    if (err) {
      console.error(err);
      res.status(500).send("Something went wrong");
    } else {
      console.log("Profile picture successfully uploaded")
      let user;
      try {
        user = jwt.decode(req.headers.authorization.split(" ")[1]).user;
        console.log(`user = ${user}`);
      } catch (e) {
        console.log("Unauthorized user")
        res.status(401).send("UNAUTHORIZED");
      }
      sql = `UPDATE user SET picture_id = ? WHERE user_id = ?`
      db.query(sql, [result.insertId, user], function(err, result) {
        if (err) {
          console.error(err);
          res.status(500).send("Something went wrong");
        } else {
          res.status(201).send({ picture_id: result.insertId }); 
        }
      });
    }
  });
});

// TODO: doesn't really work
router.get("/single/:id", function(req, res, next) {
  let sql = `SELECT image_path FROM images WHERE image_id = ?`
  db.query(sql, [req.params.id], function(err, result) {
    if (err) {
      console.error(err);
      res.status(500).send("Something went wrong");
    } else {
      res.status(200).sendFile(`/public/images/${result}.png`)
    }
  });
});

module.exports = router;
