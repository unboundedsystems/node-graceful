'use strict';

const Graceful = require('../');

let count = 0;
Graceful.on('exit', done => {
    setTimeout(() => {
        count++;
        done();
    }, 100)
});

Graceful.on('exit', done => {
    setTimeout(() => {
        count++;
        if (count == 2) {
            process.stdout.write('ok');
        }
        done();
    }, 200)
});

Graceful.exit('SIGINT');
