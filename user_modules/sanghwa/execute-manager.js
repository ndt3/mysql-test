/**
 * Created by ddavid on 2015-08-06.
 */

var dbCon= require("./dbcon");
var executeManager = function(res, tasks, isTransaction){
    if(isTransaction){
        // 트랜잭션 manager를 태우고
    }else{
        // request를 진행한다.
    }
};

/**
 * transaction을 지원하는
 * @param tasks
 */
executeManager.prototype.executeTransaction = function(tasks){
    dbCon.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.json({"code": 100, "status": "Error in connection database"});
            return;
        }

        if(tasks.length>0){
            // query를 날리지요
            query(connection , tasks );
        }

        connection.on('error', function (err) {
            res.json({"code": 100, "status": "Error in connection database"});
            return;
        });
    });
};

executeManager.prototype.execute = function(tasks){
    dbCon.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.json({"code": 100, "status": "Error in connection database"});
            return;
        }

        if(tasks.length>0){
            // query를 날리지요
            try{
                query(connection , tasks );
            }catch(e){

            }

        }

        connection.on('error', function (err) {
            res.json({"code": 100, "status": "Error in connection database"});
            return;
        });
    });
};

executeManager.prototype.query = function(connection, tasks){
    // query manager 로 query 를 뽑아서
    if(tasks.length> 0){
        // queue 방식을 사용하기 위해.
        var task = tasks.shift();
        var query = getQuery(task.queryMenu, task.queryId, task.filed, task.data);
        connection.query(query
            , function (err, rows) {

                console.log(rows);
                if (!err) {
                    //res.json(list);
                    task.callback(rows, tasks, function(){
                        if(tasks.length> 0){
                            query(connection, tasks);
                        }else{
                            // query 가 정상적으로 끝난경우.
                            connection.commit();
                            connection.release();
                        }
                    });
                }else{
                    // error 처리를 해야함
                    console.log(err);
                    connection.release();
                }
            });
    }
};

module.exports = 'executeManager';
