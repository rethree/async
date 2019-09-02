import { AsyncTask, Option } from './types';
export declare const task: <a>(task: import("./types").Lazy<PromiseLike<Option<a>[]>>) => AsyncTask<a>;
export declare const Task: <a, bs extends any[]>(x: Promise<a> | ((...args: bs) => Promise<a>), ...args: bs) => AsyncTask<a>;
export declare const complete: <a>(x: a | Promise<a>) => AsyncTask<a>;
export declare const fail: <a>(x: a) => AsyncTask<a>;
export declare const from: <a>(x: Option<a>[]) => AsyncTask<a>;
