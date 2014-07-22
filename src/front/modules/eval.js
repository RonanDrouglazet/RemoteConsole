// try to eval some js string
RemoteConsole.on("eval", function(data) {
    try {
        eval(data.value);
    } catch (e) {
        console.error("eval error: ", e);
    }
});
