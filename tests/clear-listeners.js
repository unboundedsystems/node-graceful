'use strict';

const Graceful = require('../graceful');

let handler = done => {
    process.stdout.write('should-not-run');
    done()
};

Graceful.on('exit', handler);

Graceful.off('exit', handler);

Graceful.exit();