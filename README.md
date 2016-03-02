# node-graceful

node-graceful is a small helper modules without dependencies that aims to ease graceful exit
 of a complex node program including async waiting of multiple independent modules.

Installation:
`npm i -S node-graceful`

dependencies
## Quick example

```javascript
const Graceful = require('node-graceful');
 
Graceful.on('exit', (done, event, signal) => {
    setTimeout(() => {
        console.log(`Received ${signal} - Exiting gracefully`)
        done()
    }, 1000);
})

//  Gracefull will wait untill all listeners has finished
Graceful.on('exit', () => {
       console.log("Another independant listener!");
       return Promise.resolve('A promise to be waited on before dying');
    });
```

The module is written in Node 4.x flavored es6.
  To get the es5 transpiled version use `require('node-graceful/es5')`


## Graceful

### Graceful.on({String} signal, {Function} listener [, {Boolean} deadly])

Add a listener to a given signal.
Any signal can be listened on in the addition of `exit` event that will be triggered by all "Deadly events".
Graceful listens on every signal only once and propagate the event to its listeners

Default Deadly events: `SIGTERM` `SIGINT` `SIGBREAK` `SIGHUP` 

#### Options
- `signal` - a string representing the signal name. this will be used directly as the event name on `process` object.
    Common signals can be found [here](https://nodejs.org/api/process.html#process_signal_events).
     its better to use the built in `exit` event as it catches all events that induce process exit.
- `listener(done, event, signal)` - listener function
    - `done` - callback that should be called once all exiting tasks were completed
    - `event` - if an event was provided by the process it will be provided as second argument else undefined
    - `signal` - the signal that triggered the exit.example: 'SIGTERM'
    
    **note: Promise can be returned instead of calling `done`
- `deadly` - (options) boolean indicating weather this should be considered a process ending event.
e.g. should `exit` event should be called due to this event. default: false.

##### example
```javascript

const server = require('http').createServer(function (req, res) {
    res.write('ok');
    res.end()
})

Graceful.on('exit', (done, event, signal) => {
    console.log("Received exit signal");
    server.close(() => {
        console.log("Closed all connection. safe to exit");
        done()    
    })
})
```


### Graceful.off({String} signal, {Function} listener)

Remove listener.

##### example
```javascript

const gracefulExit = () => {
    console.log("exiting!");
}

// add listener
Graceful.on('SIGTERM', gracefulExit);

// remove listener
Graceful.off('SIGTERM', gracefulExit);
```


### Graceful.clear({String} \[signal])

Remove all listeners of a given signal or all listeners of all signals.

- `signal` - (optional) signal to be cleared from all of its listeners.
 if no signal is provided all listeners for all signals are cleared 
 effectively resetting the module.

##### example
```javascript

const gracefulExit = () => {
    console.log("exiting!");
}

// add listener
Graceful.on('exit', () => {
       console.log("Received some exit signal!");
       return Promise.resolve("A promise to be waited on before dying");
    });
    
Graceful.on('exit', (done) => {
       console.log("Another listener");
       done();
    });

// remove all listener
Graceful.clear('exit');

// removes ALL listeners of ALL signals
// Graceful.clear();
```
