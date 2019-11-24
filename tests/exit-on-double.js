'use strict';

const Graceful = require('../');

Graceful.on('exit', () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            process.stdout.write('should-not-run');
            resolve();
        }, 1000)
    });
});


Graceful.exit('SIGBREAK');

setTimeout(() => Graceful.exit('SIGBREAK'), 500);
