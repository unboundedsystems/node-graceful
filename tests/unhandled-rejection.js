'use strict';

const Graceful = require('../');
Graceful.captureRejections = true;


Graceful.on('exit', () => {
    process.stdout.write('ok');
});

setTimeout(() => {}, 99999999); // keep event-loop running endlessly

Promise.reject(new Error('DANG!'));
