import { ofType, unionize, UnionOf } from 'unionize';
import { StrMap, _ } from './types';

export type Option = UnionOf<typeof Options>;

export const Options = unionize({
  Completed: ofType<[{ value: _; meta?: StrMap }]>(),
  Faulted: ofType<[{ reason: _; meta?: StrMap }]>()
});

export const isFaulted = <a>(x: Option): x is Failure => x.tag === 'faulted';

export const allCompleted = <a>(x: Option<a>[]): x is Completion<a>[] =>
  !x.some(isFaulted);
