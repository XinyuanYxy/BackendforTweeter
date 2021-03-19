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
   
    connection.query("DROP DATABASE tweeter", function(err, result) {
        if (err) throw err;
        console.log("Database successfully dropped!")
    });

    connection.end();
});