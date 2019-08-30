import { InitialAlgebra, Sequence } from '../@types';

const nil = <a>(): Sequence<a> => ({
  next: nil,
  alg: () => null as any,
  map: _ => nil() as any,
  done: true,
  value: null
});

const concat = <a>(x: a, fa: Sequence<a>): Sequence<a> => ({
  map: f => concat(f(x), fa) as any,
  alg: () => x,
  next: () => fa,
  done: false,
  value: x
});

export const Seq = <a>(): InitialAlgebra<a, Sequence<a>> => [nil, concat];
