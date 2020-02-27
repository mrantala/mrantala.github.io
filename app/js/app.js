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
$("#readTable").on('click',function(e){
    readWeightData()
});