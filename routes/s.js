var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var taskM = require('../user_modules/sanghwa/task');
var executeManager = require('../user_modules/sanghwa/execute-manager');

/**
 *  test url
 */

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET s */
router.get('/insert/user', function(req, res, next) {
  res.send('this first time to check url pattern');
});

router.get('/nottransactionTest/test1', function(req, res, next) {
  console.log(taskM);
  console.log(taskM.makeTasks());
  console.log(executeManager.start(res, taskM.makeTasks(), false));



});

router.get('/transactionTest/rollback', function(req, res, next) {
  var connection = mysql.createConnection(
      {
        host     : 'localhost',
        user     : 'node',
        password : 'barusoft11',
        database : 'node'
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
    connection.query('INSERT INTO tb_board SET content=?', 'content ddd', function(err, result) {
      console.log('result ' + result);

      if (err) {
        return connection.rollback(function() {
          connection.end(function(err) {
            // The connection is terminated now
          });
          throw err;
        });
      }

      var log = 'Post ' + result.insertId + ' added';

      connection.query('INSERT INTO log SET data=?', log, function(err, result) {
        if (err) {
          return connection.rollback(function() {
            connection.end(function(err) {
              // The connection is terminated now
            });
            throw err;
          });
        }
        connection.commit(function(err) {
          if (err) {
            return connection.rollback(function() {
              connection.end(function(err) {
                // The connection is terminated now
              });
              throw err;
            });
          }else{
            connection.end(function(err) {
              // The connection is terminated now
            });
            console.log('success!');
          }
        });
      });
    });
  });
  res.send('transaction finished');
});

router.get('/transactionTest/commit', function(req, res, next) {

  var connection = mysql.createConnection(
      {
        host     : 'localhost',
        user     : 'node',
        password : 'barusoft11',
        database : 'node'
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
          connection.query('INSERT INTO tb_board SET content=?', 'content ddd', function(err, result) {
            if (err) {
              return connection.rollback(function() {
                connection.end(function(err) {
                  // The connection is terminated now
                });
                throw err;
              });
      }

      console.log(result);

      var log = 'Post ' + result.insertId + ' added';

      var qu = 'INSERT INTO tb_board_reply (BOARD_SEQ, CONTENT)   VALUES (?, ?)';

      connection.query(qu, [result.insertId, 'DDDED'], function(err, result) {
        if (err) {
          return connection.rollback(function() {
            connection.end(function(err) {
              // The connection is terminated now
            });
            throw err;
          });
        }
        connection.commit(function(err) {
          if (err) {
            return connection.rollback(function() {
              connection.end(function(err) {
                // The connection is terminated now
              });
              throw err;
            });
          }else{
            connection.end(function(err) {
              // The connection is terminated now
            });
            console.log('success!');
          }
        });
      });
    });
  });
  res.send('transaction finished');
});


router.get('/transactionTest/commit', function(req, res, next) {

});

module.exports = router;