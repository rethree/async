"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const options_1 = require("./options");
exports.task = (task) => Object.defineProperty(() => task(), types_1.TypeRep, {
    writable: false,
    configurable: false,
    enumerable: false
});
exports.Task = (x, ...args) => exports.task(() => {
    const thenable = x instanceof Promise ? x : x(...args);
    return thenable
        .then(x => options_1.Completed(x, { args }))
        .catch(x => options_1.Faulted(x, { args }));
});
exports.complete = (x) => exports.Task(x instanceof Promise ? x : Promise.resolve(x));
exports.fail = (x) => exports.Task(Promise.reject(x));
exports.from = (x) => exports.task(() => Promise.resolve(x));
//# sourceMappingURL=task.js.map