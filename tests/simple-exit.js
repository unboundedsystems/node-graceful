'use strict';

const Graceful = require('../');

Graceful.on('exit', done => {
    return new Promise((resolve) => {
        setTimeout(() => {
            process.stdout.write('ok');
            resolve();
        }, 100)
    });
});

setTimeout(() => null,99999999);
