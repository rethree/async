import { Lifted } from './symbols';

export * from './symbols';

export type StrMap<a = any> = {
  readonly [key: string]: a;
};

export type Lazy<a> = () => a;

export type Meta = {
  readonly meta: StrMap;
};

export type Faulted = Meta & {
  readonly tag: 'faulted';
  readonly error: Error;
};

export type Done<a> = Meta & {
  readonly tag: 'done';
  readonly value: a;
};

export type Variant<a> = Faulted | Done<a>;

export type Variants<a> = Variant<a>[];

export type AsyncTask<a> = Lazy<Promise<Variant<a>>> &
  Identity<Promise<Variant<a>>>;

export type ParallelTask<a> = Lazy<Promise<Variants<a>>> &
  Identity<Promise<Variants<a>>>;

export type AnyTask<a> = AsyncTask<a> | ParallelTask<a>;
// Lazy<Promise<Variant<a> | Variants<a>>>;

export type FAlgebra<a> = { alg: () => a };

export type Enumerable<a> = FAlgebra<a> & {
  len: () => number;
  readonly succ: () => Enumerable<a>;
};

export type LinkedList<a> = {
  readonly succ: () => LinkedList<a>;
  readonly map: <b>(f: (x: a) => b) => LinkedList<b>;
} & Enumerable<a>;

export type Free<a> = {
  readonly succ: () => Free<a>;
  readonly map: <b>(f: (x: FAlgebra<a>) => FAlgebra<b>) => Free<b>;
  readonly chain: <b>(faffb: (ffa: FAlgebra<a>) => Free<b>) => Free<b>;
} & Enumerable<FAlgebra<a>>;

export type Identity<a> = FAlgebra<a> &
  Lazy<a> & {
    map: () => Identity<a>;
  };

export type Rec<f extends Function> = {
  [Lifted]: f;
};

export type Step<a, bs extends any[]> = (x: a, ...args: bs) => a | Lift<a, bs>;

export type Lift<a, bs extends any[]> = (
  f: Lazy<Step<a, bs>>
) => Rec<Lazy<Step<a, bs>>>;
