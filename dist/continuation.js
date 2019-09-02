"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const options_1 = require("./options");
const task_1 = require("./task");
exports.apply = (f) => (results) => (options_1.allCompleted(results) ? f(results)() : results);
exports.pipe = (f) => (wa) => {
    return task_1.task(() => wa().then(exports.apply(f)));
};
exports.Continuation = (x) => {
    const me = Object.assign(x, {
        extend: f => exports.Continuation(task_1.task(() => x().then(a => (options_1.allCompleted(a) ? f(exports.Continuation(task_1.from(a)))() : a)))),
        pipe: f => me.extend(exports.pipe(f)),
        map: f => {
            const thenable = x().then(exports.apply(f));
            return exports.Continuation(task_1.task(() => thenable));
        }
    });
    return me;
};
//# sourceMappingURL=continuation.js.map