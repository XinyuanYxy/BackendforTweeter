var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
});

connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    
    connection.query("CREATE DATABASE IF NOT EXISTS tweeter", function (err, result) {
        if (err) throw err;
        console.log("Database created!");
    });

    connection.query("USE tweeter");
    let sql = `CREATE TABLE IF NOT EXISTS user (
        user_id BIGINT AUTO_INCREMENT PRIMARY KEY, 
        email VARCHAR(256) NOT NULL UNIQUE, 
        password VARCHAR(256) NOT NULL, 
        username VARCHAR(20) NOT NULL UNIQUE,
        fname VARCHAR(256) NOT NULL, 
        lname VARCHAR(256) NOT NULL, 
        picture_id BIGINT DEFAULT 1,
        birthday DATE, 
        description TEXT,
        FOREIGN KEY (picture_id) REFERENCES images(image_id)
    )`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Created user table!");
    });
    
    sql = `CREATE TABLE IF NOT EXISTS images (
        image_id BIGINT AUTO_INCREMENT PRIMARY KEY,
        image_path TEXT NOT NULL
    )`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Created images table!");
    });

    sql = `CREATE TABLE IF NOT EXISTS post (
        post_id BIGINT AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT NOT NULL,
        date DATE NOT NULL,
        content TEXT,
        picture_id BIGINT,
        FOREIGN KEY (picture_id) REFERENCES images(image_id),
        FOREIGN KEY (user_id) REFERENCES user(user_id),
        CONSTRAINT chk_post CHECK (content IS NOT NULL OR picture_id IS NOT NULL)
    )`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Created post table!");
    });

    sql = `CREATE TABLE IF NOT EXISTS following (
        user_id BIGINT NOT NULL,
        following_id BIGINT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES user(user_id),
        FOREIGN KEY (following_id) REFERENCES user(user_id),
        PRIMARY KEY(user_id, following_id)
    )`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Created following table!");
    });

    sql = `CREATE TABLE IF NOT EXISTS reply (
        reply_id BIGINT AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT NOT NULL,
        post_id BIGINT NOT NULL,
        date DATE NOT NULL,
        content TEXT,
        picture_id BIGINT,
        FOREIGN KEY(picture_id) REFERENCES images(image_id), 
        FOREIGN KEY (user_id) REFERENCES user(user_id),
        FOREIGN KEY (post_id) REFERENCES post(post_id),
        CONSTRAINT chk_reply CHECK (content IS NOT NULL OR picture_id IS NOT NULL)
    )`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Created reply table!");
    });

    
    connection.end();
});