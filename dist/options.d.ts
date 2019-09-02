import { Completion, Failure, Option, StrMap } from './types';
export declare const Faulted: <a>(reason: a, meta?: StrMap<any>) => Failure[];
export declare const Completed: <a>(value: a, meta?: StrMap<any>) => Completion<a>[];
export declare const isFaulted: <a>(x: Option<a>) => x is Failure;
export declare const allCompleted: <a>(x: Option<a>[]) => x is Completion<a>[];
