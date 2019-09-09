import { AsyncTask, ParallelTask, Variant } from '../@types';
import { Id } from './Identity';

export const lift = <a>(xs: a) => (Array.isArray(xs) ? xs : [xs]) as a & any[];

export const Parallel = <a>(...tasks: AsyncTask<a>[]): ParallelTask<a> =>
  Id(() => {
    const results = Array.of<Variant<a>>();
    return new Promise(f => {
      tasks.forEach(async task => {
        results.push(...lift(await task()));
        if (results.length === tasks.length) f(results);
      });
    });
  });
