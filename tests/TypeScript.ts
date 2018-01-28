import {Graceful} from "../graceful";

const listener = (done, event, signal) => {
    done();
};

const listenerPromise = (done, event, signal) => Promise.resolve();

Graceful.on("exit", listener);
Graceful.on("exit", listener, true);
Graceful.on("exit", listenerPromise);
Graceful.on("exit", listenerPromise, true);

Graceful.off("exit", listener);

Graceful.clear();
Graceful.clear("SIGTERM");

Graceful.exit();
Graceful.exit(1);
Graceful.exit(0, "SIGTERM");
Graceful.exit("SIGTERM");

Graceful.exitOnDouble = true;
Graceful.timeout = 30000;
