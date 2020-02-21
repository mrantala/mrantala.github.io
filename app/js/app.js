console.log("app.js");
var dbName = "www_weights";
var dbVersion = 1;
var settingsDBName = "settings";
var weightsDBName = "weights";

function createDB(){
    var request = window.indexedDB.open(dbName,dbVersion);
    
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
}

    $('#datepicker').datepicker({
      autoclose: true
    });
    
$('#weightTable').DataTable({
    "lengthMenu": [31,100,180,365]
});
$("#addRecord").on('click', function (event){
    var dbOpenRequest = window.indexedDB.open(dbName,1);
    
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
        
    }
});

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

createDB();