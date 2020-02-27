console.log("settings.js");
wWw = {
    version: "0.0.0",
    dbName: "www_weights",
    dbVersion: 1,
    
    conversionFactor: 0.45359237, //0.45359237kg = 1lb
    settingsDBName: "settings",
    settingKeyPath: "setting",
    weightsDBName: "weights",
    weightsKeyPath: "guid"
};

wWw.core = {

    namespace: function(ns) {
      if (ns.substring(0,4) === "wWw.") {
          ns = ns.substring(4)
      }

      var parts = ns.split("."),
          object = wWw,
          i, len;

          for (i=0, len=parts.length; i < len; i++) {
              if (!object[parts[i]]) {
                  object[parts[i]] = {};
              }
              object = object[parts[i]];
          }

          return object;
    },

    startup: function(){
    },
    
    generateUUID: function() { // Public Domain/MIT
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
}

console.log(" wWw.core-"+wWw.version+".js Loaded");
wWw.core.startup();
