console.log("db.js");


function makeCSV(){
    var theCSV = "";
    theCSV+="Name,Data,Lover"+"\n";
    theCSV+="Matt,Yes,Carrie"+"\n";
    theCSV+="A,B,C"+"\n";
    var theTable = readWeightData();
    return theCSV;
}

