// +----------------------------------------------------------------------+
// | node-graceful v0.1.1 (https://github.com/mrbar42/node-graceful)      |
// | Graceful process exit manager.                                       |
// |----------------------------------------------------------------------|
"use strict";

var Graceful = {
    exitOnDouble: true,
    timeout: 30000
};
var listeners = Object.create(null);
listeners.exit = [];
var DEADLY_EVENTS = ["SIGTERM", "SIGINT", "SIGBREAK", "SIGHUP"];

var isExiting = false;

Graceful.on = function (signal, callback, deadly) {
    if (signal != "exit") {
        register(signal);

        // add signal to deadly list
        if (deadly && DEADLY_EVENTS.indexOf(signal) == -1) {
            DEADLY_EVENTS.push(signal);
        }
    }

    listeners[signal].push(callback);
};

Graceful.off = function (signal, listener) {
    var index = listeners[signal].indexOf(listener);

    if (index != -1) {
        listeners[signal].splice(index, 1);
    }
};

Graceful.clear = function (signal) {
    var keys = signal ? [signal] : Object.keys(listeners);

    keys.forEach(function (sig) {
        delete listeners[sig];
        process.removeListener(sig, handler);
    });
};

Graceful.exit = function (code, signal) {
    if (typeof code == "number") {
        process.exitCode = code;
    }

    handler(signal || DEADLY_EVENTS[0]);
};

// Register builtin events
DEADLY_EVENTS.forEach(function (event) {
    return register(event);
});

module.exports = Graceful;

function handler(signal, event) {
    var deadly = DEADLY_EVENTS.indexOf(signal) != -1;
    var signalListeners = listeners[signal].slice();
    var exitListeners = listeners.exit.slice();
    var targetCount = signalListeners.length + (deadly && exitListeners.length || 0);
    var count = 0;

    if (!targetCount) {
        return process.nextTick(function () {
            return killProcess();
        });
    }

    var quit = function () {
        count++;
        if (count >= targetCount) {
            if (deadly) killProcess();
        }
    };

    // exec all listeners
    signalListeners.forEach(function (listener) {
        return invokeListener(listener, quit, event, signal);
    });

    // also invoke general exit listeners
    if (deadly) {
        if (isExiting) {
            if (Graceful.exitOnDouble) killProcess(true);
        } else {
            isExiting = true;
            if (parseInt(Graceful.timeout)) {
                setTimeout(function () {
                    return killProcess(true);
                }, Graceful.timeout);
            }
            exitListeners.forEach(function (listener) {
                return invokeListener(listener, quit, event, signal);
            });
        }
    }
}

function killProcess(force) {
    process.exit(process.exitCode || (force ? 1 : 0));
}

function invokeListener(listener, quit, event, signal) {
    var invoked = false;
    // listener specific callback
    var done = function () {
        if (!invoked) {
            invoked = true;
            quit();
        }
    };

    var retVal = listener(done, event, signal);
    // allow returning a promise
    if (typeof Promise != "undefined" && retVal instanceof Promise) {
        retVal.then(done)["catch"](done);
    }
}

function register(signal) {
    if (!listeners[signal]) {
        listeners[signal] = [];
        process.on(signal, function (event) {
            return handler(signal, event);
        });
    }
}

