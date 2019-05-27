'use strict';

const Graceful = require('../');

Graceful.on('exit', done => {
    setTimeout(() => {
        process.stdout.write('ok');
        done();
    }, 100)
});

setTimeout(() => {}, 99999999);
