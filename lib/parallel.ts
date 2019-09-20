import { AsyncTask } from './types';

export const Parallel = <a>(...tasks: AsyncTask<a>[]): AsyncTask<a> => () =>
  Promise.all(tasks.flatMap(lazy => lazy())).then(x => x.flat());
