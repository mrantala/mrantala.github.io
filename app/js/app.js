console.log("app.js");


$("#downloadButton").on('click',function(e){
    window.open( "/data.csv", "_blank");
});

    $('#datepicker').datepicker({
      autoclose: true
    });
    
$('#weightTable').DataTable({
    "lengthMenu": [31,100,180,365]
});
$("#addRecord").on('click', function (event){
    addRecord(event);
});

var theTable = readWeightData();




var dbName = "www_weights";
var dbVersion = 1;
var settingsDBName = "settings";
var weightsDBName = "weights";
var theTable = {};
function readWeightData(){console.log("readWeightData");
    var dbOpenRequest = self.indexedDB.open(dbName,1);
    
    dbOpenRequest.onsuccess = function(event) {
            var db = event.target.result;
            var transaction = db.transaction("weights");
            var weightStore = transaction.objectStore(weightsDBName);
            var weightCursor = weightStore.openCursor();
            
            weightCursor.onsuccess = function(e){
                var cursor = event.target.result;
                
                if (!cursor){return;}
                console.log(cursor.value);
                theTable[theTable.length] = cursor.value;
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
function addRecord(event){
        var dbOpenRequest = self.indexedDB.open(dbName,1);
    
    dbOpenRequest.onsuccess = function(event) {
        var db = event.target.result;
        var transaction = db.transaction("weights","readwrite");
        var weightStore = transaction.objectStore(weightsDBName);
        var theWeight = $("#inputWeight")[0].value;
        var theUnits = "unk";
        if ($("#lbUnits")[0].checked === true){
            theUnits = "lb";
        } else {
            if ($("#kgUnits")[0].checked === true){
                theUnits = "kg";
            }
        }
        var theDate = $("#datepicker")[0].value; 
        var thisEntry = {"guid":generateUUID(),"date":theDate,"weight":theWeight,"units":theUnits};
        weightStore.add(thisEntry);
        addFakeData();
    }
}
function addFakeData (){
    console.log("addFakeData");
    var dbOpenRequest = self.indexedDB.open(dbName,1);
    
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

function createDB(){
    var request = self.indexedDB.open(dbName,dbVersion);
    
    request.onerror = function(e){
        console.log("Daabase error: ",event.target.error);
    }
    
    request.onsuccess = function(event) {
        var db = event.target.result;
        console.log("Database: ",db);
        console.log("Object store names: ",db.objectStoreNames);
    }
    
    request.onupgradeneeded = function(event) {
        var db = event.target.result;
        if (!db.objectStoreNames.contains(settingsDBName)) {
            db.createObjectStore(settingsDBName, {keyPath: "setting"});
        }
        
        if (!db.objectStoreNames.contains(weightsDBName)) {
            var weightsStore = db.createObjectStore(weightsDBName, {keyPath: "guid"});
            
            weightsStore.createIndex("date_idx", "date", {unique: false});
            weightsStore.createIndex("weight_idx", "weight", {unique: false});
        }
    }
    
    addFakeData();
    readWeightData();
}

createDB();