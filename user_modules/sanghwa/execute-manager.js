/**
 * Created by ddavid on 2015-08-06.
 */
var dbCon= require("./dbcon");
var ExecuteManager = function(){

};
ExecuteManager.prototype.start = function (res, tasks, isTransaction ){
    if(isTransaction){
        console.log('transaction 필요');
        // 트랜잭션 manager를 태우고
    }else{
        console.log('transaction 불 필요');
        // request를 진행한다.

        this.execute(res, tasks);
    }
}

/**
 * transaction을 지원하는
 * @param tasks
 */
ExecuteManager.prototype.executeTransaction = function(tasks){
    dbCon.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.json({"code": 100, "status": "Error in connection database"});
            return;
        }

        if(tasks.length>0){
            // query를 날리지요
            executeManager.query(connection , tasks );
        }

        connection.on('error', function (err) {
            res.json({"code": 100, "status": "Error in connection database"});
            return;
        });
    });};

ExecuteManager.prototype.execute = function(res, tasks){
    dbCon.getConnection(function (err, connection) {

        if (err) {
            console.log(err);
            res.json({"code": 100, "status": "Error in connection database"});
            return;
        }

        if(tasks.length>0){
            // query를 날리지요
            try{
                executeManager.query(connection , tasks );
            }catch(e){
                console.log(e);
            }
        }

        connection.on('error', function (err) {
            res.json({"code": 100, "status": "Error in connection database"});
            return;
        });
    });
};

ExecuteManager.prototype.query = function(res, connection, tasks){
    // query manager 로 query 를 뽑아서
    if(tasks.length> 0){
        // queue 방식을 사용하기 위해.
        var task = tasks.shift();
        // var query = getQuery(task.queryMenu, task.queryId, task.filed, task.data);
        var query = task.testQuery;

        connection.query(query
            , function (err, rows) {

                console.log(rows);
                if (!err) {
                    //res.json(list);
                        if(tasks.length> 0){
                            if(task.callback == null) {
                                executeManager.query(connection, tasks);
                            }else {
                                task.callback(rows, tasks, function(){
                                    executeManager.query(connection, tasks);
                                });
                            }
                        }else{
                            // query 가 정상적으로 끝난경우.
                            connection.release();
                            res.send('completely finish inserts');
                        }
                }else{
                    // error 처리를 해야함
                    console.log(err);
                    connection.release();
                }
            });
    }
};

var executeManager= new ExecuteManager();
module.exports = executeManager;
