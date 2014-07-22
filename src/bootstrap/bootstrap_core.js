(function(w){
    var r = w.location.search;
    if (r.indexOf("console=") !== -1 && !w.consoleLoading) {
        var u = r.substr(r.indexOf("console=")).split("&")[0].split("=")[1];
        var s = document.createElement("script");
        s.src = u + "/console_front.min.js";
        document.getElementsByTagName("head")[0].appendChild(s);
        w.consoleLoading = true;
    }
})(window);
