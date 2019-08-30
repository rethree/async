import { Fault, Success } from './variants';
import { AsyncTask, IO } from '../@types';

const task = <a, ps extends any[]>(
  x: Promise<a> | ((...args: ps) => Promise<a>),
  ...args: ps
): IO<AsyncTask<a>> => {
  const promise = x instanceof Promise ? x : x(...args);
  return () => promise.then(Success({ args })).catch(Fault({ args }));
};

task.from = <a>(x: a | Promise<a>): IO<AsyncTask<a>> =>
  task(x instanceof Promise ? x : Promise.resolve(x));

task.faulted = <a>(x: a): IO<AsyncTask<a>> => task(Promise.reject(x));

export const Task = task;
