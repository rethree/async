"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_1 = require("./task");
exports.Parallel = (...tasks) => task_1.task(() => Promise.all(tasks.map(lazy => lazy())).then(x => x.flat()));
//# sourceMappingURL=parallel.js.map