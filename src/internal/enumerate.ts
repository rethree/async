import { Enumerable } from '../../@types';

export const enumerate = function*<a>(fa: Enumerable<a>) {
  let pos = fa;
  while (!isEmpty(pos)) {
    yield pos.alg();
    pos = pos.succ();
  }
};

export const asArray = <a>(fa: Enumerable<a>) => [...enumerate(fa)];

export const isEmpty = <a>(fa: Enumerable<a>) => fa.len() < 1;
