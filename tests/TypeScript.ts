import Graceful from "../";

const listener = (done: () => {}, event: any, signal: string) => {
    done();
};

const listenerPromise = (done: () => {}, event: any, signal: string) => Promise.resolve("abc");
Graceful.on("exit", listener);
const listenerPromise1 = (done: () => {}, event: any, signal: string) => Promise.resolve({});
Graceful.on("exit", listenerPromise1);
const listenerPromise2 = (done: () => {}, event: any, signal: string) => new Promise((resolve) => {
    resolve();
});
Graceful.on("exit", listenerPromise2);

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
