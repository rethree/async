import { AsyncTask, ParallelTask, Variant, IO } from '../@types';
import { lift } from './utils/array';

export const Parallel = <a>(
  ...tasks: IO<AsyncTask<a>>[]
): IO<ParallelTask<a>> => () => {
  const eithers = Array.of<Variant<a>>();
  return new Promise(f => {
    tasks.forEach(async task => {
      eithers.push(...lift(await task()));
      if (eithers.length === tasks.length) f(eithers);
    });
  });
};
