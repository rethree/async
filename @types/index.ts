import { Lifted } from './symbols';

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

export type Done<a> = Meta & {
  readonly tag: 'done';
  readonly value: a;
};

export type Variant<a> = Faulted | Done<a>;

export type Variants<a> = Variant<a>[];

export type AsyncTask<a> = IO<Promise<Variant<a>>>;

export type ParallelTask<a> = IO<Promise<Variants<a>>>;

export type AnyTask<a> = IO<Promise<Variant<a> | Variants<a>>>;

export type FAlgebra<a> = { alg: () => a };

export type Enumerable<a> = FAlgebra<a> & {
  len: () => number;
  readonly succ: () => Enumerable<a>;
};

export type LinkedList<a> = {
  readonly succ: () => LinkedList<a>;
  readonly map: <b>(f: (x: a) => b) => LinkedList<b>;
} & Enumerable<a>;

export type FreeList<a> = {
  readonly succ: () => FreeList<a>;
  readonly map: <b>(f: (x: FAlgebra<a>) => FAlgebra<b>) => FreeList<b>;
  readonly chain: <b>(faffb: (ffa: FAlgebra<a>) => FreeList<b>) => FreeList<b>;
} & Enumerable<FAlgebra<a>>;

export type Rec<f extends Function> = {
  [Lifted]: f;
};

export type Step<a, bs extends any[]> = (x: a, ...args: bs) => a | Lift<a, bs>;

export type Lift<a, bs extends any[]> = (
  f: IO<Step<a, bs>>
) => Rec<IO<Step<a, bs>>>;
