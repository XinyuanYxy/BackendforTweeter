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
    const sql = `CREATE TABLE IF NOT EXISTS user (
        user_id BIGINT AUTO_INCREMENT PRIMARY KEY, 
        email VARCHAR(256) NOT NULL UNIQUE, 
        password VARCHAR(256) NOT NULL, 
        fname VARCHAR(256) NOT NULL, 
        lname VARCHAR(256) NOT NULL, 
        picture_id BIGINT NOT NULL, 
        birthday DATE, 
        description TEXT)`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Created user table!");
    });

    connection.end();
});