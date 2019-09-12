import { Lifted } from './symbols';

export * from './symbols';

export type _ = unknown;

export type StrMap<a = any> = {
  readonly [key: string]: a;
};

export type Lazy<a> = () => a;

export type Meta = {
  readonly meta: StrMap;
};

export type Fault = Meta & {
  readonly tag: 'faulted';
  readonly error: Error;
};

export type Completion<a> = Meta & {
  readonly tag: 'completed';
  readonly value: a;
};

export type Option<a> = Fault | Completion<a>;

export type AsyncTask<a> = Lazy<Promise<Option<a>[]>>;

export type Functor<a> = {
  map: <b>(f: (x: a) => b) => Functor<b>;
};

export type FAlgebra<a> = Functor<a> & { alg: () => a };

export type Enumerable<a> = FAlgebra<a> & {
  readonly succ: () => Enumerable<a>;
  len: () => number;
};

export type Extract<a> = () => a;

export type Comonad<a> = {
  map: <b>(f: (x: a) => b) => Comonad<b>;
  extend: <b>(f: (w: Comonad<a>) => b) => Comonad<b>;
  duplicate: () => Comonad<Lazy<a>>;
} & Extract<a> &
  FAlgebra<a>;

export type ListSpec<a> = {
  readonly succ: () => ListSpec<a>;
  readonly map: <b>(f: (x: a) => b) => ListSpec<b>;
} & Enumerable<a>;

export type Rec<f extends Function> = {
  [Lifted]: f;
};

export type Step<a, bs extends any[]> = (x: a, ...args: bs) => a | Lift<a, bs>;

export type Lift<a, bs extends any[]> = (
  f: Lazy<Step<a, bs>>
) => Rec<Lazy<Step<a, bs>>>;
