// return HTMLElement outerHTML retrieve by getElementsByTagName from a given tagName
RemoteConsole.on("getTag", function(data) {
    var value = data.value.split(":");
    var node = document.getElementsByTagName(value[0])[value[1] || 0];
    if (node) {
        console.log(node.outerHTML || node.innerHTML);
    } else {
        console.error("getTag error: ", "no node with tagName " + data.value);
    }
});
