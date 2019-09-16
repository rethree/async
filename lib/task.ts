import { AsyncTask, Option, TypeRep, Thenable } from './types';
import { Completed, Faulted } from './options';

export const task = <a, bs extends any[] = any[]>(
  task: Thenable<a, bs>
): AsyncTask<a, bs> =>
  Object.defineProperty((...args: bs) => task(...args), TypeRep, {
    writable: false,
    configurable: false,
    enumerable: false
  });

export const Task = <a, bs extends any[]>(
  x: Promise<a> | ((...args: bs) => Promise<a>)
): AsyncTask<a> =>
  task((...args: bs) => {
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
