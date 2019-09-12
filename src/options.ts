import { Completion, Failure, Option, StrMap } from '../@types';

export const Faulted = <a>(reason: a, meta: StrMap = {}): Failure[] => [
  {
    tag: 'faulted',
    fault: reason,
    meta
  }
];

export const Completed = <a>(value: a, meta: StrMap = {}): Completion<a>[] => [
  {
    tag: 'completed',
    value,
    meta
  }
];

export const isFaulted = <a>(x: Option<a>): x is Failure => x.tag === 'faulted';

export const allCompleted = <a>(x: Option<a>[]): x is Completion<a>[] =>
  !x.some(isFaulted);
