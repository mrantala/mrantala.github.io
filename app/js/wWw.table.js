console.log("wWw.table.js");
wWw.core.namespace("wWw.table");

wWw.table = {
    startup: function(){
    },
}

console.log(" wWw.table-"+wWw.version+".js Loaded");
wWw.table.startup();

function readWeightData(){console.log("readWeightData");
    var dbOpenRequest = window.indexedDB.open(wWw.dbName,wWw.dbVersion);
    var theTable = {};
    dbOpenRequest.onsuccess = function(event) {
        var db = event.target.result;
        var transaction = db.transaction("weights");
        var weightStore = transaction.objectStore(wWw.weightsDBName);
        var weightCursor = weightStore.openCursor();
        
        weightCursor.onsuccess = function(event){
            var cursor = event.target.result;

            if (!cursor){tableToCSV(theTable);return;}
                theTable[Object.keys(theTable).length] = cursor.value;
                cursor.continue();
        }
       
    }
}

function generateUUID2() { // Public Domain/MIT
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
    var dbOpenRequest = window.indexedDB.open(wWw.dbName,wWw.dbVersion);

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
        var thisEntry = {"guid":wWw.core.generateUUID(),"date":theDate,"weight":theWeight,"units":theUnits};
        weightStore.add(thisEntry);
        addFakeData();
    }
}

function tableToCSV(dd){
    var theString = "guid,date,weight,units";
    for (var key of Object.keys(dd) ) {
        tempTable = dd[key];
        thisLine = "\n"+tempTable["guid"]+","+tempTable["date"]+","+tempTable["weight"]+","+tempTable["units"];
        theString+=thisLine;
    }
    // console.log(theString);
    sendToServiceWorker(theString);
}

function addFakeData (){
    console.log("addFakeData");
    var dbOpenRequest = window.indexedDB.open(wWw.dbName,wWw.dbVersion);
    
    dbOpenRequest.onsuccess = function(event) {
            var db = event.target.result;
            var transaction = db.transaction("weights","readwrite");
            var weightStore = transaction.objectStore(wWw.weightsDBName);
            var thisEntry = {"guid":wWw.core.generateUUID(),"date":"03/08/1970","weight":170.2,"units":"lb"};
            weightStore.add(thisEntry);
            var thisEntry = {"guid":wWw.core.generateUUID(),"date":"03/09/1970","weight":170.4,"units":"lb"};
            weightStore.add(thisEntry);
            var thisEntry = {"guid":wWw.core.generateUUID(),"date":"03/08/1978","weight":170.5,"units":"lb"};
            weightStore.add(thisEntry);
            var thisEntry = {"guid":wWw.core.generateUUID(),"date":"04/12/1970","weight":170.3,"units":"lb"};
            weightStore.add(thisEntry);
        
    }
}

function createDB(){
    var request = window.indexedDB.open(wWw.dbName,wWw.dbVersion);
    
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
        if (!db.objectStoreNames.contains(wWw.settingsDBName)) {
            db.createObjectStore(wWw.settingsDBName, {keyPath: wWw.settingKeyPath});
        }
        
        if (!db.objectStoreNames.contains(wWw.weightsDBName)) {
            var weightsStore = db.createObjectStore(wWw.weightsDBName, {keyPath: wWw.weightsKeyPath});
            
            weightsStore.createIndex("date_idx", "date", {unique: false});
            weightsStore.createIndex("weight_idx", "weight", {unique: false});
        }
    }
    
    addFakeData();
}

createDB();