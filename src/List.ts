import { InitialAlgebra, LinkedList } from '../@types';
import { trampoline } from './utils';

const nil = <a>(): LinkedList<a> => ({
  alg: () => null as any,
  map: _ => nil() as any,
  succ: nil
});

const succ = <a>(x: a, fa: LinkedList<a>): LinkedList<a> => ({
  map: f => succ(f(x), fa) as any,
  alg: () => x,
  succ: () => fa
});

const list = <a>(): InitialAlgebra<a, LinkedList<a>> => [
  (x, fb = nil()) => succ(x, fb),
  nil
];

export const List = list;

export const isNil = <a>(xs: LinkedList<a>) => xs.alg() === null;

export const Cata = <a>(fa: LinkedList<a>, it: (acc: a, x: a) => a): a => {
  const run = trampoline<a, [LinkedList<a>]>(
    jump =>
      function rec(acc, fa) {
        return isNil(fa) ? acc : jump(() => rec(it(acc, fa.alg()), fa.succ()));
      }
  );

  return run(fa.alg(), fa.succ());
};

export const Ana = <a>(as: a[]): LinkedList<a> =>
  as.reduce((acc, x) => succ(x, acc), nil<a>());

export const Enumerator = function*<a>(fa: LinkedList<a>) {
  let pos = fa;
  while (pos.alg() !== null) {
    yield pos.alg();
    pos = pos.succ();
  }
};
