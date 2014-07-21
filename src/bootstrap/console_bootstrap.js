(function(){
    var r = window.location.search;
    if (r.indexOf("console=") !== -1 && !window.consoleRetain) {
        window.consoleRetain = {log: [], info: [], error: [], warn: []};
        window.console.log = function(){ window.consoleRetain.log.push(arguments) };
        window.console.warn = function(){ window.consoleRetain.warn.push(arguments) };
        window.console.info = function(){ window.consoleRetain.info.push(arguments) };
        window.console.error = function(){ window.consoleRetain.error.push(arguments) };
        window.onerror = function(){ window.console.error(arguments) };

        var u = r.substr(r.indexOf("console=")).split("&")[0].split("=")[1];
        var s = document.createElement("script");
        s.src = u + "/console_front.min.js";
        document.getElementsByTagName("head")[0].appendChild(s);
    }
})();
