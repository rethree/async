export type _ = unknown;
export type Nil = undefined;

export type StrMap<a = any> = {
  readonly [key: string]: a;
};

export type Func<a, b> = (x: a) => b;
export type Join = any;

export type Lazy<a> = () => a;

export type Meta = {
  readonly meta: StrMap;
};

export type Failure = { fault: any; meta?: StrMap };

export type Completion<a> = { value: a; meta?: StrMap };

export type Options<a> =
  | Failure & { tag: "Faulted" }
  | Completion<a> & { tag: "Completed" };

export type AsyncTask<a, bs extends any[] = any[]> = (
  ...args: bs
) => PromiseLike<Options<a>[]>;

export type Functor<a> = {
  readonly map: <b>(f: (x: a) => b) => Functor<b>;
};

export type ContinuationComonad<a> = {
  readonly map: <b>(
    f: (ca: Completion<a>[]) => AsyncTask<b>
  ) => ContinuationComonad<a | b>;
  readonly pipe: <b>(
    f: (ca: Completion<a>[]) => AsyncTask<b>
  ) => ContinuationComonad<a | b>;
  readonly extend: <b>(
    f: (wa: ContinuationComonad<a>) => AsyncTask<b>
  ) => ContinuationComonad<b>;
} & Functor<a> &
  AsyncTask<a>;
