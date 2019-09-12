import { AsyncTask, Completion, Option } from '../@types';
import { Completed, Faulted, allCompleted } from './options';

export const Task = <a, bs extends any[]>(
  x: Promise<a> | ((...args: bs) => Promise<a>),
  ...args: bs
): AsyncTask<a> => {
  const promise = x instanceof Promise ? x : x(...args);
  return () =>
    promise.then(x => Completed(x, { args })).catch(x => Faulted(x, { args }));
};

export const complete = <a>(x: a | Promise<a>): AsyncTask<a> =>
  Task(x instanceof Promise ? x : Promise.resolve(x));

export const fail = <a>(x: a): AsyncTask<a> => Task(Promise.reject(x));

export const pipe = <a, b>(
  task: Promise<Option<a>[]>,
  f: (x: Completion<a>[]) => b
) => task.then(x => (allCompleted(x) ? Completed(f(x)) : x));

export * from './Parallel';

export * from './Sequence';
