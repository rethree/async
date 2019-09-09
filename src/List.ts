import { LinkedList } from '../@types';
import { asArray, cata, enumerate, cons, nil } from './internal';

const empty = <a>(): LinkedList<a> => ({
  ...nil(),
  map: empty
});

// because of (desired) lazy-recursive / immutable nature of the structure
// mapping over is necessarily slow.
const map = <a, b, Fa extends LinkedList<a>>(fa: Fa, xf: (x: a) => b) =>
  asArray(fa).reduceRight<LinkedList<b>>(
    (acc, x) => prepend(xf(x), acc),
    empty()
  );

const prepend = <a>(x: a, fa: LinkedList<a> = empty()): LinkedList<a> => ({
  ...cons<a, LinkedList<a>>(x, fa),
  map: <b>(xf: (x: a) => b) => map(prepend(x, fa), xf)
});

const ana = <a>(as: a[]): LinkedList<a> =>
  as.reduce((acc, x) => prepend(x, acc), empty<a>());

export const List = {
  Cons: prepend,
  Empty: empty,
  map,
  fold: cata,
  fromArray: ana,
  enumerate
};
