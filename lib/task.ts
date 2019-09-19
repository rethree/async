import { AsyncTask, Options } from './types';
import { Option } from './options';

export const Task = <a, bs extends any[]>(
  x: Promise<a> | ((...args: bs) => Promise<a>)
): AsyncTask<a> => (...args: bs) => {
  const thenable = x instanceof Promise ? x : x(...args);
  return thenable
    .then(x => [Option<a>().Completed({ value: x as a, meta: { args } })])
    .catch(x => [Option<a>().Faulted({ fault: x as a, meta: { args } })]);
};

export const complete = <a>(x: a | Promise<a>): AsyncTask<a> =>
  Task(x instanceof Promise ? x : Promise.resolve(x));

export const fail = <a>(x: a): AsyncTask<a> => Task(Promise.reject(x));

export const from = <a>(x: Options<a>[]): AsyncTask<a> => () =>
  Promise.resolve(x);
