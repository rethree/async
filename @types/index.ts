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

export type Functor<a> = {
  map: <b>(f: (x: a) => b) => Functor<b>;
};

export type FAlgebra<a> = Functor<a> & { alg: () => a };

export type LinkedList<a> = {
  readonly succ: () => LinkedList<a>;
  readonly len: () => number;
  readonly map: <b>(f: (x: a) => b) => LinkedList<b>;
} & FAlgebra<a>;

// export type FreeList<a> = FAlgebra<
//   FAlgebra<a>,
//   {
//     hkt: FreeList<a>;
//   },
//   {
//     chain: <b>(faffb: (ffa: FAlgebra<a>) => FreeList<b>) => FreeList<b>;
//   }
// >;

export type Rec<f extends Function> = {
  [Lifted]: f;
};

export type Step<a, bs extends any[]> = (x: a, ...args: bs) => a | Lift<a, bs>;

export type Lift<a, bs extends any[]> = (
  f: IO<Step<a, bs>>
) => Rec<IO<Step<a, bs>>>;
