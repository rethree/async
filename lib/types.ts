export type _ = unknown;
export type Nil = undefined;

export type StrMap<a = any> = {
  readonly [key: string]: a;
};

export type Func<a, b> = (x: a) => b;

export type Meta = {
  readonly meta: StrMap;
};

export type Failure = { fault: any; meta?: StrMap };

export type Completion<a> = { value: a; meta?: StrMap };

export type Options<a> =
  | Failure & { tag: "Faulted" }
  | Completion<a> & { tag: "Completed" };

export type TaskDef<a> = {
  map: <b>(ab: Func<a, b>, resume?: true) => TaskDef<b>;
  chain: <b>(ab: Func<a, TaskDef<b>>, resume?: true) => TaskDef<b>;
  then: <b>(done: Func<Options<a>, b>) => void;
};

export type Thenable<a> = PromiseLike<a>;

export type Computation =
  | [Func<_, TaskDef<_>>, true, true | Nil]
  | [Func<_, _>, false, true | Nil];
