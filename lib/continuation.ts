import {
  Completion,
  ContinuationComonad,
  Failure,
  LazyTask,
  Option
} from './types';
import { allCompleted } from './options';
import { from } from './task';

export const apply = <a, b>(f: (x: Completion<a>[]) => LazyTask<b>) => (
  results: Option<a>[]
): Failure[] | Completion<b>[] =>
  (allCompleted(results) ? f(results)() : results) as any;

export const Continuation = <a>(x: LazyTask<a>): ContinuationComonad<a> => {
  const me: Pick<ContinuationComonad<a>, 'map' | 'extend' | 'pipe'> = {
    extend: f =>
      Continuation(() =>
        x().then(a => (allCompleted(a) ? f(Continuation(from(a))) : a) as any)
      ),
    pipe: f => me.extend(wa => wa().then(apply(f))),
    map: f => {
      const ran = x().then(apply(f));
      return Continuation(() => ran);
    }
  };

  return Object.assign(() => x(), me);
};
