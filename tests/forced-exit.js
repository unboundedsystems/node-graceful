'use strict';

const Graceful = require('../');

Graceful.timeout = 1000;

Graceful.on('exit', () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            process.stdout.write('not-supposed-to-run');
            resolve();
        }, 2000);
    });
});

Graceful.exit();
