import { InitialAlgebra, LinkedList } from '../@types';
import { trampoline } from './utils';

const nil = <a>(): LinkedList<a> => ({
  next: nil,
  alg: () => null as any,
  map: _ => nil() as any,
  done: true,
  value: null as any
});

const succ = <a>(x: a, fa: LinkedList<a>): LinkedList<a> => ({
  map: f => succ(f(x), fa) as any,
  alg: () => x,
  next: () => fa,
  done: false,
  value: x
});

const list = <a>(): InitialAlgebra<a, LinkedList<a>> => [
  (x, fb = nil()) => succ(x, fb),
  nil
];

export const List = list;

export const Cata = <a>(fa: LinkedList<a>, f: (acc: a, x: a) => a) => {
  const run = trampoline(
    jump =>
      function rec(acc: a, fa: LinkedList<a>) {
        return fa.done ? acc : jump(() => rec(f(acc, fa.value), fa.next()));
      }
  );

  return run(fa.value, fa.next()) as a;
};

export const Ana = <a>([hd, ...tl]: a[]) =>
  trampoline(
    jump =>
      function rec(fa: LinkedList<a>, [hd, ...tl]: a[]) {
        return hd ? jump(() => rec(succ(hd, fa), tl)) : fa;
      }
  )(succ(hd, nil()), tl) as LinkedList<a>;
