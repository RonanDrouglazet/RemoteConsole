var express = require("express"),
io = require("socket.io"),
ip = require("ip"),
fs = require('fs'),
http = require("http"),
colors = require("colors");

var nodeConsole = express();
var serverIo = http.createServer(nodeConsole);
var socketIo = io.listen(serverIo);

var sessions = [];
var interfaces = [];

nodeConsole.use("/", express.static(__dirname + "/../../dist/"));
nodeConsole.get("/cmd/:command", function(req, res) {

    var id = req.param("targetId"), command = req.param("command"), value = req.param("value");
    var isId = (id && sessions[id].socket);
    var receivers = isId ? sessions[id].socket : socketIo.sockets;

    receivers.emit(command, {value: value});
    print(command + " from server to client: ".grey, id);
    print((isId ? "--> " + sessions[id].socket.request.headers['user-agent'] : "--> all client").grey, id);
    print(value, id);
    res.send();
});

socketIo.on("connection", function (socket) {
    socket.on("newSession", startSession.bind(socket));
    socket.on("newInterface", startInterface.bind(socket));
    socket.emit("init");
});

function startSession() {
    var id = sessions.length;
    sessions.push({socket:this, filename: new Date() + "_Session_" + id + ".txt"});
    print("-----------------------------------------------------------------".red, id);
    print("Session " + ("(id:" + id + ")").green + " started on " + this.request.headers['user-agent'], id);
    print("-----------------------------------------------------------------".red, id);

    this.on("c_log", function (data) {
        log("Log", this, "green", data, id);
    });
    this.on("c_info", function (data) {
        log("Info", this, "green", data, id);
    });
    this.on("c_warn", function (data) {
        log("Warn", this, "yellow", data, id);
    });
    this.on("c_error", function (data) {
        log("Error", this, "red", data, id);
    });
    this.on('disconnect', function () {
        print(("Disconnect Session " + id + " on " + this.request.headers['user-agent']).grey, id);
    });
}

function startInterface() {
    interfaces.push(this);
}

function log(title, socket, color, data, id) {
    print(("[" + data.time + "] " + title + " from Session " + id + ": ")[color], id);
    for (var i in data.message) {
        print(data.message[i], id);
    }
    interfaces.forEach(function(obj, i) {
        obj.emit(title, data.message);
    });
}

function print(message, id) {
    var newLine = (/(\[[\d+:]+\]|from server|Disconnect)/ig.test(message) ? "\n" : "");

    if (newLine) {
        console.log(newLine + message);
    } else {
        console.log(message);
    }

    if (typeof message === "object") {
        message = JSON.stringify(message);
    } else {
        message = message.toString();
    }

    message = newLine + message.replace(/(001b|\\u|\[\d+m|)/g, "");

    fs.mkdir(__dirname + "/../../logs/", 0777, function(error) {
        if (id) {
            fs.appendFileSync(__dirname + "/../../logs/" + sessions[id].filename, message + " \n");
        } else {
            sessions.forEach(function(obj, index) {
                fs.appendFileSync(__dirname + "/../../logs/" + obj.filename, message + " \n");
            });
        }
    });
}

serverIo.listen(8080);
console.log("-----------------------------------------------------------------".red);
console.log("Remote console running. Put this param on the url to debug: ".green, "?console=http://" + ip.address() + ":8080");
