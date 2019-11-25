'use strict';

const Graceful = require('../');
Graceful.timeout = 50;

Graceful.on('exit', done => {
    return new Promise((resolve) => {
        setTimeout(() => {
            process.stdout.write('ok1');
            resolve();
        }, 10)
    });
});

Graceful.on('exit', done => {
    return new Promise((resolve) => {
        setTimeout(() => {
            process.stdout.write('ok2');
            resolve();
        }, 100)
    });
});

setTimeout(() => {}, 99999999);
