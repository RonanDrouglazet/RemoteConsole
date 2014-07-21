// return HTMLElement outerHTML retrieve by getElementById from a given id
RemoteConsole.on("getId", function(data) {
    var node = document.getElementById(data.value);
    if (node) {
        console.log(node.outerHTML || node.innerHTML);
    } else {
        console.error("getId error: ", "no node with id " + data.value);
    }
});
