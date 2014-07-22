// check the cache status for all script files on page
// TODO css file too
RemoteConsole.on("checkCache", function(data) {
    var domArray = document.getElementsByTagName("script");
    var jsArray = [], jsObject = {}, checked = 0;

    var handler = function(url, type) {
        var obj = jsObject[url];
        if (this.readyState === this.DONE && this.status === 200) {
            obj[type] = this.responseText;
            if (obj.current && obj.updated) {
                obj.status = (obj.current === obj.updated) ? "OK" : "OUTDATED";
                obj.current = obj.updated = null;
            }
            checked++;
        } else if (this.readyState === this.DONE && this.status === 0) {
            obj.current = obj.updated = null;
            obj.status = "CROSS-DOMAIN";
            checked++;
        }

        if (checked === jsArray.length * 2) {
            console.warn(jsObject);
        }
    }

    var request = function(url, type, timestamp) {
        var ts = timestamp || "";
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = handler.bind(xhr, url, type);
        xhr.open("GET", url + ts);
        xhr.send();
    }

    for (var i in domArray) {
        if (domArray.hasOwnProperty(i) && domArray[i].src && domArray[i].src !== "" && !/(socket\.io|console_front)/g.test(domArray[i].src)) {
            jsArray.push(domArray[i].src);
            var param = domArray[i].src.indexOf("?") !== -1 ? "&" : "?";
            jsObject[domArray[i].src] = {
                current: null,
                updated: null
            }
            request(domArray[i].src, "current");
            request(domArray[i].src, "updated", param + Date.now());
        } else {

        }
    }
});
