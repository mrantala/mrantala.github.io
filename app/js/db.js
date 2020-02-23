console.log("db.js");
var theTable = {};
function readWeightData(){
    var dbOpenRequest = window.indexedDB.open(dbName,1);
    
    dbOpenRequest.onsuccess = function(event) {
            var db = event.target.result;
            var transaction = db.transaction("weights","read");
            var weightStore = transaction.objectStore(weightsDBName);
            var weightCursor = weightStore.openCursor();
            
            weightCursor.onsuccess = function(e){
                var cursor = event.target.result;
                
                if (!cursor){return;}
                console.log(cursor.value);
                theTable.push(cursor.value);
                cursor.continue();
            }
        
    }
    return theTable;
}

function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = (performance && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function addFakeData (){
    var dbOpenRequest = window.indexedDB.open(dbName,1);
    
    dbOpenRequest.onsuccess = function(event) {
            var db = event.target.result;
            var transaction = db.transaction("weights","readwrite");
            var weightStore = transaction.objectStore(weightsDBName);
            var thisEntry = {"guid":generateUUID(),"date":"03/08/1970","weight":170.2,"units":"lb"};
            weightStore.add(thisEntry);
                        var thisEntry = {"guid":generateUUID(),"date":"03/09/1970","weight":170.4,"units":"lb"};
            weightStore.add(thisEntry);
                        var thisEntry = {"guid":generateUUID(),"date":"03/08/1978","weight":170.5,"units":"lb"};
            weightStore.add(thisEntry);
                        var thisEntry = {"guid":generateUUID(),"date":"04/12/1970","weight":170.3,"units":"lb"};
            weightStore.add(thisEntry);
        
    }
}

function makeCSV(){
    var theCSV = "";
    theCSV+="Name,Data,Lover"+"\n";
    theCSV+="Matt,Yes,Carrie"+"\n";
    theCSV+="A,B,C"+"\n";
    var theTable = readWeightData();
    return theCSV;
}