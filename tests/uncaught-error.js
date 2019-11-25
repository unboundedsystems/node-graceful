'use strict';

const Graceful = require('../');
Graceful.captureExceptions = true;


Graceful.on('exit', () => {
    process.stdout.write('ok');
});

setTimeout(() => {}, 99999999); // keep event-loop running endlessly

throw new Error('DANG!');
