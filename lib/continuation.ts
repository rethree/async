import { allCompleted } from './options';
import { from } from './task';
import {
  AsyncTask,
  Completion,
  ContinuationComonad,
  Failure,
  Option
} from './types';

export const apply = <a, b>(f: (x: Completion<a>[]) => AsyncTask<b>) => (
  results: Option<a>[]
): Failure[] | Completion<b>[] =>
  (allCompleted(results) ? f(results)() : results) as any;

export const pipe = <a, b>(f: (wa: Completion<a>[]) => AsyncTask<b>) => (
  wa: ContinuationComonad<a>
) => {
  return () => wa().then(apply(f));
};

export const Continuation = <a>(x: AsyncTask<a>): ContinuationComonad<a> => {
  const me = Object.assign(x, {
    extend: f =>
      Continuation(() =>
        x().then(a => (allCompleted(a) ? f(Continuation(from(a)))() : a) as any)
      ),
    pipe: f => me.extend(pipe(f)),
    map: f => {
      const thenable = x().then(apply(f));
      return Continuation(() => thenable);
    }
  } as Pick<ContinuationComonad<a>, 'extend' | 'pipe' | 'map'>);

  return me;
};
