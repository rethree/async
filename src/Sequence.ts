import { InitialAlgebra, Sequence } from '../@types';

const nil = <a>(): Sequence<a> => ({
  next: nil,
  alg: () => null as any,
  map: _ => nil() as any,
  done: true,
  value: null as any
});

const succ = <a>(x: a, fa: Sequence<a>): Sequence<a> => ({
  map: f => succ(f(x), fa) as any,
  alg: () => x,
  next: () => fa,
  done: false,
  value: x
});

export const Seq = <a>(): InitialAlgebra<a, Sequence<a>> => [
  x => succ(x, nil()),
  succ,
  nil
];

export const Cata = <a>(fa: Sequence<a>, f: (x: a, y: a) => a, acc: a): a =>
  fa.done ? acc : Cata(fa.next(), f, f(acc, fa.value));
