import { AsyncTask, Option, TypeRep, Thenable } from './types';
import { Completed, Faulted } from './options';

export const task = <a>(task: Thenable<a>): AsyncTask<a> =>
  Object.defineProperty(() => task(), TypeRep, {
    writable: false,
    configurable: false,
    enumerable: false
  });

export const Task = <a, bs extends any[]>(
  x: Promise<a> | ((...args: bs) => Promise<a>),
  ...args: bs
): AsyncTask<a> =>
  task(() => {
    const thenable = x instanceof Promise ? x : x(...args);
    return thenable
      .then(x => Completed(x, { args }))
      .catch(x => Faulted(x, { args }));
  });

export const complete = <a>(x: a | Promise<a>): AsyncTask<a> =>
  Task(x instanceof Promise ? x : Promise.resolve(x));

export const fail = <a>(x: a): AsyncTask<a> => Task(Promise.reject(x));

export const from = <a>(x: Option<a>[]): AsyncTask<a> =>
  task(() => Promise.resolve(x));
