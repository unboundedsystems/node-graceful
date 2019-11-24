'use strict';

const Graceful = require('../');

let count = 0;
Graceful.on('exit', () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            count++;
            resolve();
        }, 100);
    });
});

Graceful.on('exit', () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            count++;
            if (count === 2) {
                process.stdout.write('ok');
            }
            resolve();
        }, 200);
    });
});

Graceful.exit('SIGINT');
