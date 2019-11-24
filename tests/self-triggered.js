'use strict';

const Graceful = require('../');

Graceful.on('exit', () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            process.stdout.write('ok');
            resolve();
        }, 100);
    });
});

process.emit('SIGTERM');
