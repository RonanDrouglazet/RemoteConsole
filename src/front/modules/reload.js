// reload current page
RemoteConsole.on("reload", function(data) {
    window.location.href = window.location.href + "&rcts=" + Date.now();
});
