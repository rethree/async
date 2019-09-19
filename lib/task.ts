import { Completed, Faulted } from './options';
import { AsyncTask, Option } from './types';

export const Task = <a, bs extends any[]>(
  x: Promise<a> | ((...args: bs) => Promise<a>)
): AsyncTask<a> => (...args: bs) => {
  const thenable = x instanceof Promise ? x : x(...args);
  return thenable
    .then(x => Completed(x, { args }))
    .catch(x => Faulted(x, { args }));
};

export const complete = <a>(x: a | Promise<a>): AsyncTask<a> =>
  Task(x instanceof Promise ? x : Promise.resolve(x));

export const fail = <a>(x: a): AsyncTask<a> => Task(Promise.reject(x));

export const from = <a>(x: Option<a>[]): AsyncTask<a> => () =>
  Promise.resolve(x);
