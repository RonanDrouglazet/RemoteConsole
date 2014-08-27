(function(paramsUrl){

    var rc = function() {
        var scripts = document.getElementsByTagName("script");
        var domain = "localhost:8080";
        for (var i in scripts) {
            if (scripts[i].src && scripts[i].src.indexOf("console_front") !== -1) {
                domain = scripts[i].src.split("/")[2];
            }
        }
        this.server = "http://" + domain;
        this.module = {};
    };

    rc.prototype.init = function() {
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

        // listen each module
        for (var moduleName in this.module) {
            if (this.module.hasOwnProperty(moduleName)) {
                this.socket.on(moduleName, this.module[moduleName]);
            }
        }

        // init
        this.socket.on("init", function() {
            this.socket.emit("newSession");
            this.clearConsoleRetain();
        }.bind(this));
    };

    rc.prototype.clearConsoleRetain = function() {
        // if we miss some log when this file was loading, retrieve it and log it !
        if (window.consoleRetain) {
            for (var i in window.consoleRetain) {
                window.consoleRetain[i].forEach(function(arg, index) {
                    window.console[i].apply(window, arg);
                });
            }
            window.consoleRetain = {};
        }
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

    // init remote console
    window.RemoteConsole = new rc();
    window.RemoteConsole.init();

})(window.location.search);
