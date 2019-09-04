import { FAlgebra, FreeList } from '../@types';

const pure = <a>(): FreeList<a> => ({
  alg: () => pure() as any,
  map: _ => pure(),
  chain: _ => pure()
});

const free = <a>(fa: FAlgebra<a>): FreeList<a> => ({
  map: fafa => free(fafa(fa)),
  alg: () => fa,
  chain: faffb => free(faffb(fa))
});

// export const Free = <a>(): LinkedList<FAlgebra<a>> => {};
