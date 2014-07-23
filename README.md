RemoteConsole
=============

Web debugging tool on a remote browser

Some mobile device does not supports classic debug console (safari and chrome with the mobile connected on your desktop) and proxy too. so in these cases, debuging seems to be impossible..
That's why a remote console was born, it allow you to see logs / error and execute JS commands and some other tests, but with remote facility ! no more cable ! your device just need to be on the same local network as your desktop. Can be use on classic desktop browser too

# Requirement

 * [nodejs](http://nodejs.org/download/)
 * [npm](http://npmjs.org/)

# How to use

## Build

If you have ebuzzing/EbzFormat on your machine, skip this step and go to the step `run`

To build the project, run:

    npm install && grunt

## Bootstrap

If you want to use the remote console with ebuzzing/EbzFormat or ebuzzing/EbzPlatform, skip this step and go to the step `run`. 
This step is just for external use of remote console.

1) Script + Url param

With the js bootstrap, you can implement remote console on your page, and activate it on your page with just a param in your url when you need it.

Put ./dist/console_bootstrap.min.js on a accessible server and call for it with a script node on your html page:

    <script src="http://yourserver/console_bootstrap.min.js"></script>
    
OR just copy/past console_bootstrap.min.js content on your html page.

Then, when you want to activate the remote console on your page, just put a param in your url like this:

    ?console=http://RemoteConsoleServerIp
    
off course, you have to replace `RemoteConsoleServerIp` with the ip that RemoteConsole gives you when you run it on your machine (see step `run`)

2) Direct call with script

You can also call directly the console, without url param:

    <script src="http://RemoteConsoleServerIp/console_front.min.js"></script> 
    
BUT your remote console will be call ALL THE TIME, do that only if you are not on a production environnement etc..

## Run

### EbzFormat User

Go on your ebuzzing/EbzFormat folder, and just run `make debug` to build and run the remote console with EbzFormat's implementation
In your terminal, you will see the param to put on your url to debug, and all logs will appear here.
You can also go on `http://localhost:8080` and open your web brower tools (classic browser console), all the log you see on your terminal will appear here too

To do some action on your page, execute js / command / etc.. run `make console` in an other terminal window

### Other user

To run remote console server and see logs from your html page, run:

    node src/back/console_back.js
  
In your terminal, you will see the param to put on your url to debug, and all logs will appear here.
You can also go on `http://localhost:8080` and open your web brower tools (classic browser console), all the log you see on your terminal will appear here too

To do some action on your page, execute js / command / etc.. run `sh console.sh` in an other terminal window

![logs_terminal](http://imageshack.com/a/img743/4938/958958.png)
![logs_browser](http://imageshack.com/a/img539/4462/c9f25f.png)
![command](http://imageshack.com/a/img673/8849/ebfcaf.png)



    

