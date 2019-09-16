export const TypeRep = Symbol('@@TASK');

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

export type Thenable<a, bs extends any[] = any[]> = (
  ...args: bs
) => PromiseLike<Option<a>[]>;

export type AsyncTask<a, bs extends any[] = any[]> = Thenable<a, bs> & {
  [TypeRep];
};

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
} & Functor<a> & AsyncTask<a>;
