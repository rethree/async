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

export type AsyncTask<a> = Promise<Variant<a>>;

export type ParallelTask<a> = Promise<Variant<a>[]>;
