import { AsyncTask, Option } from '../@types';

export const lift = <a>(xs: a) => (Array.isArray(xs) ? xs : [xs]) as a & any[];

export const Parallel = <a>(...tasks: AsyncTask<a>[]): AsyncTask<a> => () => {
  const results = Array.of<Option<a>>();
  return new Promise(f => {
    tasks.forEach(async task => {
      results.push(...lift(await task()));
      if (results.length === tasks.length) f(results);
    });
  });
};
