import { Fault, Success } from './variants';
import { AsyncTask } from '../@types';
import { Id } from './Identity';

const task = <a, bs extends any[]>(
  x: Promise<a> | ((...args: bs) => Promise<a>),
  ...args: bs
): AsyncTask<a> => {
  const promise = x instanceof Promise ? x : x(...args);
  return Id(() => promise.then(Success({ args })).catch(Fault({ args })));
};

task.from = <a>(x: a | Promise<a>): AsyncTask<a> =>
  task(x instanceof Promise ? x : Promise.resolve(x));

task.faulted = <a>(x: a): AsyncTask<a> => task(Promise.reject(x));

export const Task = task;
