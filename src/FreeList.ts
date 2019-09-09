import { FAlgebra, FreeList } from '../@types';
import { asArray } from './internal/enumerate';
import { cata } from './internal/cata';
import { cons } from './internal';

// because of (desired) lazy-recursive / immutable nature of the structure
// mapping over is necessarily slow.
const map = <a, b>(fa: FreeList<a>, xf: (x: FAlgebra<a>) => FAlgebra<b>) =>
  asArray(fa).reduceRight<FreeList<b>>((acc, x) => prepend(xf(x), acc), pure());

const pure = <a>(): FreeList<a> => ({
  len: () => 0,
  alg: () => pure() as any,
  map: pure,
  succ: pure,
  chain: pure
});

const prepend = <a>(x: FAlgebra<a>, fa: FreeList<a> = pure()): FreeList<a> => ({
  ...cons<FAlgebra<a>, FreeList<a>>(x, fa),
  map: <b>(xf: (x: FAlgebra<a>) => FAlgebra<b>) => map(prepend(x, fa), xf),
  chain: faffb => faffb(x)
});

const ana = <a>(as: FAlgebra<a>[]): FreeList<a> =>
  as.reduce((acc, x) => prepend(x, acc), pure<a>());

export const Free = {
  Pure: pure,
  Free: prepend,
  map,
  fold: cata,
  fromArray: ana
};
