import { LinkedList } from '../@types';
import { asArray, cata, enumerate, cons } from './internal';

const nil = <a>(): LinkedList<a> => ({
  len: () => 0,
  alg: () => null as any,
  map: nil,
  succ: nil
});

// because of (desired) lazy-recursive / immutable nature of the structure
// mapping over is necessarily slow.
const map = <a, b, Fa extends LinkedList<a>>(fa: Fa, xf: (x: a) => b) =>
  asArray(fa).reduceRight<LinkedList<b>>(
    (acc, x) => prepend(xf(x), acc),
    nil()
  );

const prepend = <a>(x: a, fa: LinkedList<a> = nil()): LinkedList<a> => ({
  ...cons<a, LinkedList<a>>(x, fa),
  map: <b>(xf: (x: a) => b) => map(prepend(x, fa), xf)
});

const ana = <a>(as: a[]): LinkedList<a> =>
  as.reduce((acc, x) => prepend(x, acc), nil<a>());

export const List = {
  Cons: prepend,
  Empty: nil,
  map,
  fold: cata,
  fromArray: ana,
  enumerate
};
