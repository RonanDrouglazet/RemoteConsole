(function(w){
    if (!w.consoleRetain) {
        w.consoleRetain = {log: [], info: [], error: [], warn: []};
        w.console.log = function(){ w.consoleRetain.log.push(arguments) };
        w.console.warn = function(){ w.consoleRetain.warn.push(arguments) };
        w.console.info = function(){ w.consoleRetain.info.push(arguments) };
        w.console.error = function(){ w.consoleRetain.error.push(arguments) };
        w.onerror = function(){ w.console.error(arguments) };
    }
})(window);
