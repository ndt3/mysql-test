/**
 * Created by ddavid on 2015-08-11.
 */
var queryStorage     =    require('./query-storage');

var qp = function(){
    this.start = function (arr){
        for(var i =0; i<arr.length; i++){
            var fileName = arr[i];
            var fs = require('fs');
            var data = fs.readFileSync('query/'+ fileName, 'utf8');

            this.parsing(data);
        }
    }

    this.parsing = function (data){

        var map = [];

        var id = [];

        var startIndex = -1;
        var colonIndex = -1;
        var endIndex = -1;

        var lastStartIndex = -1;
        var lastEndIndex = -1;

        for(var i = 0;i < data.length;i++){
            if(startIndex == -1){
                if(data[i] == '{'){
                    startIndex = i;
                }
            }else{
                if(data[i] == ':'  ){
                    colonIndex = i;
                }else if(data[i] == '}'){
                    endIndex =i;
                }else if(data[i] == '{'){
                    if(data[i+1] == '/'){
                        lastStartIndex = i;
                        lastEndIndex = i+2;
                        i = i+2;

                        // doing action
                        //console.log("startIndex", startIndex);
                        //console.log("colonIndex", colonIndex);
                        //console.log("endIndex", endIndex);
                        //console.log("lastStartIndex", lastStartIndex);
                        //console.log("lastEndIndex", lastEndIndex);
                        //
                        //console.log(data.substring(startIndex+1, colonIndex));
                        //console.log(data.substring(colonIndex+1, endIndex));
                        //console.log(data.substring(endIndex+1, lastStartIndex));
                        var menu = data.substring(startIndex+1, colonIndex).trim();
                        var id = data.substring(colonIndex+1, endIndex).trim();
                        var content  = data.substring(endIndex+1, lastStartIndex).trim();

                        if(queryStorage.queryMap[menu] == null){
                            queryStorage.queryMap[menu] = [];
                        }
                        var ids = queryStorage.queryMap[menu];
                        ids[id] = content;
                        // 초기화
                        startIndex = -1;
                        colonIndex = -1;
                        endIndex = -1;

                        lastStartIndex = -1;
                        lastEndIndex = -1;

                        continue;
                    }else{
                        console.log('error');
                    }
                }
            }
        }
        return;
    },


    this.parsingQuery = function(data, filed){
        var startIndex = -1;
        var endIndex = -1;

        var lastStartIndex = -1;
        var lastEndIndex = -1;

        var currentPosition =0;

        var realQuery = '';

        for(var i = 0;i < data.length;i++){
            if(startIndex == -1){
                if(data[i] == '['){
                    startIndex = i;
                    realQuery += data.substring(currentPosition, i);
                }
            }else{
                if(data[i] == ']'){
                    endIndex =i;
                }else if(data[i] == '['){
                    if(data[i+1] == '/'){
                        lastStartIndex = i;
                        lastEndIndex = i+2;
                        i = i+2;

                        // doing action
                        console.log("startIndex", startIndex);

                        console.log("endIndex", endIndex);
                        console.log("lastStartIndex", lastStartIndex);
                        console.log("lastEndIndex", lastEndIndex);

                        console.log(data.substring(startIndex+1, endIndex));
                        console.log(data.substring(endIndex+1, lastStartIndex));

                        var checkVal = data.substring(startIndex+1, endIndex);

                        // 만약에 null 이면 모두 짜른다
                        if(filed[checkVal] != null){
                            realQuery += data.substring(endIndex+1, lastStartIndex);
                        }

                        // 초기화
                        startIndex = -1;
                        endIndex = -1;

                        lastStartIndex = -1;
                        lastEndIndex = -1;

                        currentPosition = i+2;
                        continue;
                    }else{
                        console.log('error');
                    }
                }
            }
        }
        realQuery += data.substring(currentPosition, data.length);

        console.log("input : " + data);
        console.log("output : " + realQuery);

        return realQuery;
    }
};

module.exports = new qp();