// call console.log, easier on your terminal console. [clog window.ebz] against [eval console.log(window.ebz)]
RemoteConsole.on("clog", function(data) {
    try {
        var evalued = eval(data.value);
        var result = evalued;

        if (typeof evalued === "object") {
            result = RemoteConsole.convertObjectToString(result, evalued);
        }

        console.log(result);
    } catch (e) {
        console.error("log error: ", e);
    }
});
