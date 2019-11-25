'use strict';

const Graceful = require('../');
Graceful.captureRejections = Graceful.captureExceptions = true;

Graceful.on('exit', () => {
    process.stdout.write('error');
});

setTimeout(() => {}, 99999999); // keep event-loop running endlessly

Promise.reject(new Error('DANG!'));
