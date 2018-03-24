"use strict";

import Graceful from "../";

const handlerSuccess = () => {
    return new Promise((resolve) =>  {
        setTimeout(() => {
            process.stdout.write("ok");
            resolve();
        }, 100);
    });
};

const handlerReject = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            process.stdout.write("ok");
            reject();
        }, 200);
    });
};

Graceful.on("exit", handlerSuccess);
Graceful.on("exit", handlerReject);

Graceful.exit();
