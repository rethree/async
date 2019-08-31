import { AsyncTask, ParallelTask, Variant } from '../@types';
import { lift } from './utils/array';

export const Parallel = <a>(
  ...tasks: IO<AsyncTask<a>>[]
): IParallelTask<a> => () => {
  const results = Array.of<Variant<a>>();
  return new Promise(f => {
    tasks.forEach(async task => {
      results.push(...lift(await task()));
      if (results.length === tasks.length) f(results);
    });
  });
};
