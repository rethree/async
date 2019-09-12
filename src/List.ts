import { ListSpec } from '../@types';
import { asArray } from './utils';

export const List = <a>(x?: a, fa: ListSpec<a> = nil()): ListSpec<a> => {
  if (x === undefined) return nil();
  const len = fa.len() + 1;
  return {
    len: () => len,
    alg: () => x,
    succ: () => fa,
    map: <b>(xf: (x: a) => b) => map(List(x, fa), xf)
  };
};

const nil = <a>(): ListSpec<a> => ({
  len: () => 0,
  alg: () => null as any,
  succ: nil,
  map: nil
});

// because of (desired) lazy-recursive / immutable nature of the structure
// mapping over is necessarily slow.
export const map = <a, b, Fa extends ListSpec<a>>(fa: Fa, xf: (x: a) => b) =>
  asArray(fa).reduceRight<ListSpec<b>>((acc, x) => List(xf(x), acc), nil());

export const fromArray = <a>(as: a[]): ListSpec<a> =>
  as.reduce((acc, x) => List(x, acc), nil<a>());
