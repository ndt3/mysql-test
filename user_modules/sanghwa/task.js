/**
 * Created by ddavid on 2015-08-07.
 */

// xml 기반으로 가자
var taskManager = function(){};
taskManager.prototype.getTask = function(queryMenu, queryId, filed, callback){
    var task = {
            'queryMenu' : queryMenu,
            'queryId' : queryId,
            'filed' : filed,
            'callback' : callback,
            'testQuery' : null
        };
    return task;
}

// task 를 만든다.
taskManager.prototype.makeTasks = function(){
    return [];
}

module.exports = new taskManager();