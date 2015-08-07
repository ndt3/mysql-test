/**
 * Created by ddavid on 2015-08-06.
 */
var mysql = require('mysql');

var connection = mysql.createConnection(
    {
        host     : 'localhost',
        user     : 'YOUR_USERNAME',
        password : 'YOUR_PASSWORD',
        database : 'DB_NAME'
    }
);

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

connection.beginTransaction(function(err) {
    if (err) { throw err; }
    connection.query('INSERT INTO posts SET title=?', title, function(err, result) {
        if (err) {
            return connection.rollback(function() {
                throw err;
            });
        }

        var log = 'Post ' + result.insertId + ' added';

        connection.query('INSERT INTO log SET data=?', log, function(err, result) {
            if (err) {
                return connection.rollback(function() {
                    throw err;
                });
            }
            connection.commit(function(err) {
                if (err) {
                    return connection.rollback(function() {
                        throw err;
                    });
                }
                console.log('success!');
            });
        });
    });
});



module.exports = sqlMap;
