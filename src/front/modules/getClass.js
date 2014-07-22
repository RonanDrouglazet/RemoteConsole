// return HTMLElement outerHTML retrieve by getElementsByClassName from a given className
RemoteConsole.on("getClass", function(data) {
    var value = data.value.split(":");
    var node = document.getElementsByClassName(value[0])[value[1] || 0];
    if (node) {
        console.log(node.outerHTML || node.innerHTML);
    } else {
        console.error("getClass error: ", "no node with class " + data.value);
    }
});
