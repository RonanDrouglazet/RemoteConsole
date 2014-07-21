(function(paramsUrl){

    var rc = function() {
        this.server = paramsUrl.substr(paramsUrl.indexOf("console=")).split("&")[0].split("=")[1];
        this.module = {};
    };

    rc.prototype.init = function() {
        // active ebzformats logs
        // TODO move that away
        window.name = "ebz1";
        // call socket.io to start console remote
        var s = document.createElement('script');
        s.src = this.server + '/socket.io/socket.io.js';
        s.onload = this.activeSocket.bind(this);
        document.getElementsByTagName('head')[0].appendChild(s);
    };

    rc.prototype.activeSocket = function() {
        this.socket = io(this.server);

        window.console.log = function() {
            this.socket.emit("c_log", { origin: window.location.host, message: this.convertArg(arguments), time: this.getTime() });
        }.bind(this);

        window.console.warn = function() {
            this.socket.emit("c_warn", { origin: window.location.host, message: this.convertArg(arguments), time: this.getTime() });
        }.bind(this);

        window.console.error = function() {
            this.socket.emit("c_error", { origin: window.location.host, message: this.convertArg(arguments), time: this.getTime() });
        }.bind(this);

        window.console.info = function() {
            this.socket.emit("c_info", { origin: window.location.host, message: this.convertArg(arguments), time: this.getTime() });
        }.bind(this);

        window.onerror = function() {
            this.socket.emit("c_error", { origin: window.location.host, message: this.convertArg(arguments), time: this.getTime() });
        }.bind(this);

        // if we miss some log when this file was loading, retrieve it and log it !
        if (window.consoleRetain) {
            for (var i in window.consoleRetain) {
                window.consoleRetain[i].forEach(function(arg, index) {
                    window.console[i].apply(window, arg);
                });
            }
        }

        // listen each module
        for (var moduleName in this.module) {
            if (this.module.hasOwnProperty(moduleName)) {
                this.socket.on(moduleName, this.module[moduleName]);
            }
        }

        // init
        this.socket.on("init", function() { this.socket.emit("newSession")}.bind(this));
    };

    // check if we have an object in given arguments, and stringify it
    rc.prototype.convertArg = function(arg) {
        for (var i in arg) {
            if (typeof arg[i] === "object") {
                arg[i] = this.convertObjectToString("", arg[i]);
            }
        }

        return arg;
    };

    // get the current time for log
    rc.prototype.getTime = function() {
        var d = new Date();
        var h = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
        var m = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
        var s = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
        var ms = d.getMilliseconds() < 10 ? "00" + d.getMilliseconds() : d.getMilliseconds() < 100 ? "0" + d.getMilliseconds() : d.getMilliseconds();
        return h + ":" + m + ":" + s + ":" + ms;
    };

    // when we have some big object to log like window, document, etc... we have to stringify it manually to avoid cicling error
    rc.prototype.convertObjectToString = function(str, obj) {
        try {
            str = JSON.stringify(obj, null, 2);
        } catch (e) {
            str = "{ \n";
            for (var i in obj) {
                switch (typeof obj[i]) {
                    case "function":
                        str += "\t" + i + ": [Function],\n";
                    break;

                    case "object":
                        try {
                            str += "\t" + i + ": " + JSON.stringify(obj[i], null, 2) + ",\n";
                        } catch (e) {
                            str += "\t" + i + ": " + obj[i].toString() + ",\n";
                        }
                    break;

                    default:
                        str += "\t" + i + ": " + obj[i] + ",\n";
                    break;
                }
            }
            str += "}";
        }
        return str;
    }

    // add some module to RemoteConsole
    rc.prototype.on = function(moduleName, callback) {
        if (window.RemoteConsole) {
            RemoteConsole.module[moduleName] = callback;
        }
    };

    /*
    // define some classic debug log for support's team etc..
    // TODO Finish that, we just have 10% here, define other test with @tariq
    function scanEbz(data) {
        console.log({
            "currentUrl": window.location.href,
            "pid": getAdId("pid"),
            "cid": getAdId("cid"),
            "ebz": !!window.ebz
        });
    }

    // extract pid or cid (type) on page
    function getAdId(type) {
        var r = new RegExp(type + "=\\d+", "g");
        var p = document.body.innerHTML.match(r);
        var o = {};
        if (p) {
            p.forEach(function(obj, index) {
                o[obj.substr(4)] = true;
            });
        }
        return o;
    }
    */

    window.RemoteConsole = new rc();
    window.RemoteConsole.init();
})(window.location.search);
