import { LazyTask } from '../@types';

export const Parallel = <a>(...tasks: LazyTask<a>[]): LazyTask<a> => () =>
  Promise.all(tasks.map(lazy => lazy())).then(x => x.flat());
