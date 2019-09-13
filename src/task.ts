import { LazyTask, Option } from '../@types';
import { Completed, Faulted } from './options';

export const Task = <a, bs extends any[]>(
  x: Promise<a> | ((...args: bs) => Promise<a>),
  ...args: bs
): LazyTask<a> => {
  const promise = x instanceof Promise ? x : x(...args);
  return () =>
    promise.then(x => Completed(x, { args })).catch(x => Faulted(x, { args }));
};

export const complete = <a>(x: a | Promise<a>): LazyTask<a> =>
  Task(x instanceof Promise ? x : Promise.resolve(x));

export const fail = <a>(x: a): LazyTask<a> => Task(Promise.reject(x));

export const from = <a>(x: Option<a>[]): LazyTask<a> => () =>
  Promise.resolve(x);
