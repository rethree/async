import { Enumerable } from '../../@types';

export const nil = <a, Fa extends Enumerable<a>>() => ({
  len: () => 0,
  alg: () => null as any,
  succ: () => nil() as Fa
});

export const cons = <a, Fa extends Enumerable<a>>(x: a, fa: Fa) => {
  const len = fa.len() + 1;
  return {
    len: () => len,
    alg: () => x,
    succ: () => fa
  };
};
