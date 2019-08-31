import { AsyncTask, ParallelTask, Variant } from '../@types';
import { lift } from './utils';

export const Parallel = <a>(
  ...tasks: AsyncTask<a>[]
): ParallelTask<a> => () => {
  const results = Array.of<Variant<a>>();
  return new Promise(f => {
    tasks.forEach(async task => {
      results.push(...lift(await task()));
      if (results.length === tasks.length) f(results);
    });
  });
};
