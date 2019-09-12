import { Completion, Fault, Option, StrMap } from '../@types';

export const Faulted = (reason, meta: StrMap = {}): Fault[] => [
  {
    tag: 'faulted',
    error: reason instanceof Error ? reason : Error(reason),
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

export const isFaulted = <a>(x: Option<a>): x is Fault => x.tag === 'faulted';

export const allCompleted = <a>(x: Option<a>[]): x is Completion<a>[] =>
  !x.some(isFaulted);
