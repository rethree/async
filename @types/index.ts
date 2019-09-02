import { FAlgebra } from './adt';
import { Tr } from '../src/constants';

export * from './adt';

export type StrMap<a = any> = {
  [key: string]: a;
};

export type IO<a> = () => a;

export type Fault = {
  error: Error;
  meta: StrMap;
};

export type Meta = {
  meta: StrMap;
};

export type Faulted = Meta & {
  tag: 'faulted';
  error: Error;
};

export type Succeeded<a> = Meta & {
  tag: 'succeeded';
  value: a;
};

export type Variant<a> = Faulted | Succeeded<a>;

export type AsyncTask<a> = IO<Promise<Variant<a>>>;

export type ParallelTask<a> = IO<Promise<Variant<a>[]>>;

export type AnyTask<a> = AsyncTask<a> | ParallelTask<a>;

export type LinkedList<a> = FAlgebra<
  a,
  IteratorResult<a, a> & {
    next: () => LinkedList<a>;
  }
>;

export type Trampolined<f extends Function> = {
  [Tr]: f;
};

export type Step<a, as extends any[]> = (x: a, ...args: as) => a | Jump<a, as>;

export type Jump<a, as extends any[]> = (
  f: () => Step<a, as>
) => Trampolined<() => Step<a, as>>;
