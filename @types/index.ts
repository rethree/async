import { FAlgebra } from './adt';
import { Tr } from './symbols';

export * from './adt';
export * from './symbols';

export type StrMap<a = any> = {
  readonly [key: string]: a;
};

export type IO<a> = () => a;

export type Fault = {
  readonly error: Error;
  readonly meta: StrMap;
};

export type Meta = {
  readonly meta: StrMap;
};

export type Faulted = Meta & {
  readonly tag: 'faulted';
  readonly error: Error;
};

export type Succeeded<a> = Meta & {
  readonly tag: 'succeeded';
  readonly value: a;
};

export type Variant<a> = Faulted | Succeeded<a>;

export type AsyncTask<a> = IO<Promise<Variant<a>>>;

export type ParallelTask<a> = IO<Promise<Variant<a>[]>>;

export type AnyTask<a> = AsyncTask<a> | ParallelTask<a>;

export type LinkedList<a> = FAlgebra<
  a,
  {
    readonly succ: () => LinkedList<a>;
  }
>;

export type Trampolined<f extends Function> = {
  [Tr]: f;
};

export type Step<a, bs extends any[]> = (x: a, ...args: bs) => a | Jump<a, bs>;

export type Jump<a, bs extends any[]> = (
  f: IO<Step<a, bs>>
) => Trampolined<IO<Step<a, bs>>>;
