import { LinkedList } from '../@types';
import { rec } from './utils';

const nil = <a>(): LinkedList<a> => ({
  len: () => 0,
  alg: () => null as any,
  map: nil,
  succ: nil
});

// because of (desired) lazy-recursive / immutable nature of the structure
// mapping over is necessarily slow.
const map = <a, b>(fa: LinkedList<a>, xf: (x: a) => b): LinkedList<b> =>
  [...enumerate(fa)].reduceRight<LinkedList<b>>(
    (acc, x) => cons(xf(x), acc),
    nil()
  );

const cons = <a>(x: a, fa: LinkedList<a> = nil()): LinkedList<a> => ({
  len: () => fa.len() + 1,
  map: <b>(xf: (x: a) => b) => map(cons(x, fa), xf),
  alg: () => x,
  succ: () => fa
});

export const isEmpty = <a>(xs: LinkedList<a>) =>
  xs.alg() === null && xs.len() === 0;

const cata = <a>(fa: LinkedList<a>, xf: (acc: a, x: a) => a): a =>
  rec<a, [LinkedList<a>]>(
    lift =>
      function step(acc, fa) {
        return isEmpty(fa)
          ? acc
          : lift(() => step(xf(acc, fa.alg()), fa.succ()));
      }
  )(fa.alg(), fa.succ());

const ana = <a>(as: a[]): LinkedList<a> =>
  as.reduce((acc, x) => cons(x, acc), nil<a>());

const enumerate = function*<a>(fa: LinkedList<a>) {
  let pos = fa;
  while (!isEmpty(pos)) {
    yield pos.alg();
    pos = pos.succ();
  }
};

export const List = {
  Cons: cons,
  Empty: nil,
  map,
  fold: cata,
  fromArray: ana,
  enumerate
};
