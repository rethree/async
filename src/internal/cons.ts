import { Enumerable } from '../../@types';

export const cons = <a, Fa extends Enumerable<a>>(x: a, fa: Fa) => {
  const len = fa.len() + 1;
  return {
    len: () => len,
    alg: () => x,
    succ: () => fa
  };
};
