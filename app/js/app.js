console.log("app.js");
var dbName = "www_weights";
var dbVersion = 1;
var settingsDBName = "settings";
var weightsDBName = "weights";



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
        addFakeData();
    }
});

