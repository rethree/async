import {
  Completion,
  ContinuationMonad,
  Failure,
  LazyTask,
  Option
} from '../@types';
import { allCompleted } from './options';
import { from } from './task';

export const apply = <a, b>(f: (x: Completion<a>[]) => LazyTask<b>) => (
  results: Option<a>[]
): Failure[] | Completion<b>[] =>
  (allCompleted(results) ? f(results)() : results) as any;

export const Pipe = <a>(x: LazyTask<a>): ContinuationMonad<a> => {
  const cont: Pick<ContinuationMonad<a>, 'map' | 'extend' | 'continueWith'> = {
    extend: f =>
      Pipe(() =>
        x().then(a => (allCompleted(a) ? f(Pipe(from(a))) : a) as any)
      ),
    continueWith: f => Pipe(x).extend(wa => wa().then(apply(f))),
    map: f => {
      const ran = x().then(apply(f));
      return Pipe(() => ran);
    }
  };

  return Object.assign(() => x(), cont);
};
