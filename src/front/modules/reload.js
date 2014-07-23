// reload current page
RemoteConsole.on("reload", function(data) {
    var i = window.location.href.indexOf("&rcts");
    var n = Date.now();
    var u = (i !== -1) ? window.location.href.substr(0, i) : window.location.href;
    window.location.href = u + "&rcts=" + n;
});
