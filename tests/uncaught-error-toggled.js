'use strict';

const Graceful = require('../');
Graceful.captureExceptions = true;
Graceful.captureExceptions = false;

Graceful.on('exit', () => {
    process.stdout.write('ok');
});

process.on('uncaughtException', () => {/* ignore */}); // prevent auto kill behavior on newer node versions

setTimeout(() => process.exit(0), 100);

throw new Error('DANG!');
