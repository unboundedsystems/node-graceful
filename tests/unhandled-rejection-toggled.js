'use strict';

const Graceful = require('../');
Graceful.captureRejections = true;
Graceful.captureRejections = false;

Graceful.on('exit', () => {
    process.stdout.write('ok');
});

setTimeout(() => process.exit(0), 100);

Promise.reject(new Error('DANG!'));
