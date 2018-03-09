'use strict';

const Graceful = require('../');

let handlerSuccess = () => {
    return new Promise(function (resolve) {
        setTimeout(() => {
            process.stdout.write('ok');
            resolve();
        }, 100)
    })
};

let handlerReject = () => {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            process.stdout.write('ok');
            reject();
        }, 200)
    })
};

Graceful.on('exit', handlerSuccess);
Graceful.on('exit', handlerReject);

Graceful.exit();
