#!/bin/bash

command='start'

clear
echo '  ______ ____ ______   _____ ____  _   _  _____  ____  _      ______ '
echo ' |  ____|  _ \___  /  / ____/ __ \| \ | |/ ____|/ __ \| |    |  ____|'
echo ' | |__  | |_) | / /  | |   | |  | |  \| | (___ | |  | | |    | |__   '
echo ' |  __| |  _ < / /   | |   | |  | |   \ |\___ \| |  | | |    |  __|  '
echo ' | |____| |_) / /__  | |___| |__| | |\  |____) | |__| | |____| |____ '
echo ' |______|____/_____|  \_____\____/|_| \_|_____/ \____/|______|______|'
echo '                                                                     '
echo '---------------------------------------------------------------------'
echo '# allowed command: (eval, clog, getId, getClass, getTag, reload, scan, checkCache)'
echo '# exemple: eval document.body.innerHTML="ok"'
echo '# exemple: getId container'
echo '# exemple: getTag div:1'
echo '# exemple: checkCache'
echo '# exemple: reload'
echo '# exemple: scan'
echo '---------------------------------------------------------------------'

until [ -z $command ]
do
    echo 'execute command: [command] [value] [?target=all]'
    read -p 'execute command: ' command value target
    curl "http://localhost:8080/cmd/$command?value=$value&targetId=$target"
done
