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
  readonly map: <b>(f: (x: a) => b) => Functor<b>;
};

export type Extract<a> = () => a;

export type ContinuationComonad<a> = {
  readonly map: <b>(
    f: (ca: Completion<a>[]) => LazyTask<b>
  ) => ContinuationComonad<a | b>;
  readonly pipe: <b>(
    f: (ca: Completion<a>[]) => LazyTask<b>
  ) => ContinuationComonad<a | b>;
  readonly extend: <b>(
    f: (wa: ContinuationComonad<a>) => AsyncTask<b>
  ) => ContinuationComonad<b>;
} & Extract<AsyncTask<a>>;
