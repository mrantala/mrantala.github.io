console.log("settings.js");

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
}

WwW.core.namespace("wWw.config");
WwW.config = {

}
wWw.version = "Test";
console.log(" WwW.core-"+wWw.version+".js Loaded");
WwW.core.startup();
