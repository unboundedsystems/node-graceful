// +----------------------------------------------------------------------+
// | node-graceful v0.1.1 (https://github.com/mrbar42/node-graceful)      |
// | Graceful process exit manager.                                       |
// |----------------------------------------------------------------------|
'use strict';

const Graceful = {
    exitOnDouble: true,
    timeout: 30000
};
const listeners = Object.create(null);
listeners.exit = [];
const DEADLY_EVENTS = ['SIGTERM', 'SIGINT', 'SIGBREAK', 'SIGHUP'];

let isExiting = false;

Graceful.on = function (signal, callback, deadly) {
    if (signal != 'exit') {
        register(signal);

        // add signal to deadly list
        if (deadly && DEADLY_EVENTS.indexOf(signal) == -1) {
            DEADLY_EVENTS.push(signal)
        }
    }

    listeners[signal].push(callback);
};

Graceful.off = function (signal, listener) {
    let index = listeners[signal].indexOf(listener);

    if (index != -1) {
        listeners[signal].splice(index, 1);
    }
};

Graceful.clear = function (signal) {
    let keys = signal ? [signal] : Object.keys(listeners);

    keys.forEach((sig) => {
        delete listeners[sig];
        process.removeListener(sig, handler);
    });
};

Graceful.exit = function (code, signal) {
    if (typeof code == 'number') {
        process.exitCode = code;
    }

    handler(signal || DEADLY_EVENTS[0])
};

// Register builtin events
DEADLY_EVENTS.forEach(event => register(event));

module.exports = Graceful;

function handler(signal, event) {
    let deadly = DEADLY_EVENTS.indexOf(signal) != -1;
    let signalListeners = listeners[signal].slice();
    let exitListeners = listeners.exit.slice();
    let targetCount = signalListeners.length + (deadly && exitListeners.length || 0);
    let count = 0;

    if (!targetCount) {
        return process.nextTick(() => killProcess());
    }

    let quit = () => {
        count++;
        if (count >= targetCount) {
            if (deadly) killProcess();
        }
    };

    // exec all listeners
    signalListeners.forEach(listener => invokeListener(listener, quit, event, signal));

    // also invoke general exit listeners
    if (deadly) {
        if (isExiting) {
            if (Graceful.exitOnDouble) killProcess(true);
        }
        else {
            isExiting = true;
            if (parseInt(Graceful.timeout)) {
                setTimeout(() => killProcess(true), Graceful.timeout);
            }
            exitListeners.forEach(listener => invokeListener(listener, quit, event, signal));
        }
    }
}

function killProcess(force) {
    process.exit(process.exitCode || (force ? 1 : 0));
}

function invokeListener(listener, quit, event, signal) {
    let invoked = false;
    // listener specific callback
    let done = () => {
        if (!invoked) {
            invoked = true;
            quit();
        }
    };

    let retVal = listener(done, event, signal);
    // allow returning a promise
    if (typeof Promise != 'undefined' && retVal instanceof Promise) {
        retVal.then(done).catch(done);
    }
}

function register(signal) {
    if (!listeners[signal]) {
        listeners[signal] = [];
        process.on(signal, event => handler(signal, event));
    }
}

