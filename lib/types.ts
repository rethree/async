export type _ = unknown;
export type Nil = undefined;

export const Task$ = Symbol("Task");

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

export type ContinuationDef<a> = {
  pipe: <b>(bc: Func<a, b | TaskDef<b>>) => ContinuationDef<b>;
  then: <b>(done: Func<Options<a>, b>) => void;
};

export type TaskDef<a> = ContinuationDef<a> & {
  [Task$]: true;
};
