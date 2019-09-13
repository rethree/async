export type _ = unknown;

export type StrMap<a = any> = {
  readonly [key: string]: a;
};

export type Lazy<a> = () => a;

export type Meta = {
  readonly meta: StrMap;
};

export type Failure = Meta & {
  readonly tag: 'faulted';
  readonly fault: any;
};

export type Completion<a> = Meta & {
  readonly tag: 'completed';
  readonly value: a;
};

export type Option<a> = Failure | Completion<a>;

export type AsyncTask<a> = Promise<Option<a>[]>;

export type LazyTask<a> = Lazy<AsyncTask<a>>;

export type Functor<a> = {
  map: <b>(f: (x: a) => b) => Functor<b>;
};

export type Extract<a> = () => a;

export type ContinuationMonad<a> = {
  map: <b>(f: (ca: Completion<a>[]) => LazyTask<b>) => ContinuationMonad<a | b>;
  continueWith: <b>(
    f: (ca: Completion<a>[]) => LazyTask<b>
  ) => ContinuationMonad<a | b>;
  extend: <b>(
    f: (wa: ContinuationMonad<a>) => AsyncTask<b>
  ) => ContinuationMonad<b>;
} & Extract<AsyncTask<a>>;
