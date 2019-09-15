import { AsyncTask } from './types';
import { task } from './task';

export const Parallel = <a>(...tasks: AsyncTask<a>[]): AsyncTask<a> =>
  task(() => Promise.all(tasks.map(lazy => lazy())).then(x => x.flat()));
