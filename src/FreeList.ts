import { FAlgebra, Free } from '../@types';
import { cons, nil } from './internal';
import { cata } from './internal/cata';
import { asArray } from './internal/enumerate';

// because of (desired) lazy-recursive / immutable nature of the structure
// mapping over is necessarily slow.
const map = <a, b>(fa: Free<a>, xf: (x: FAlgebra<a>) => FAlgebra<b>) =>
  asArray(fa).reduceRight<Free<b>>((acc, x) => prepend(xf(x), acc), pure());

const pure = <a>(): Free<a> => ({
  ...nil(),
  map: pure,
  succ: pure,
  chain: pure
});

const prepend = <a>(x: FAlgebra<a>, fa: Free<a> = pure()): Free<a> => ({
  ...cons<FAlgebra<a>, Free<a>>(x, fa),
  map: <b>(xf: (x: FAlgebra<a>) => FAlgebra<b>) => map(prepend(x, fa), xf),
  chain: faffb => faffb(x)
});

const ana = <a>(as: FAlgebra<a>[]): Free<a> =>
  as.reduce((acc, x) => prepend(x, acc), pure<a>());

export const FreeList = {
  Pure: pure,
  Free: prepend,
  map,
  fold: cata,
  fromArray: ana
};
