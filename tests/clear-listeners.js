'use strict';

const Graceful = require('../');

let handler = () => {
    return new Promise((resolve) => {
        process.stdout.write('should-not-run');
        resolve();
    });
};

Graceful.on('exit', handler);
Graceful.off('exit', handler);

let removeListener = Graceful.on('exit', handler.bind(null));
removeListener();

Graceful.exit();
