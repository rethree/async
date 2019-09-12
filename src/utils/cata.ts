import { Enumerable } from '../../@types';
import { rec } from './rec';
import { isEmpty } from './enumerate';

export const cata = <a>(fa: Enumerable<a>, xf: (acc: a, x: a) => a): a =>
  rec<a, [Enumerable<a>]>(
    lift =>
      function step(acc, fa) {
        return isEmpty(fa)
          ? acc
          : lift(() => step(xf(acc, fa.alg()), fa.succ()));
      }
  )(fa.alg(), fa.succ());
