"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Faulted = (reason, meta = {}) => [
    {
        tag: 'faulted',
        fault: reason,
        meta
    }
];
exports.Completed = (value, meta = {}) => [
    {
        tag: 'completed',
        value,
        meta
    }
];
exports.isFaulted = (x) => x.tag === 'faulted';
exports.allCompleted = (x) => !x.some(exports.isFaulted);
//# sourceMappingURL=options.js.map