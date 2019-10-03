import { O, Option } from "./options";
import {
  Func,
  Join,
  Options,
  _,
  TaskDef,
  ContinuationDef,
  Task$
} from "./types";
import { tryCatch, withSymbol } from "./utils";

const isTask = (x: any): x is TaskDef<_> => typeof x === "object" && Task$ in x;

const fold = (x: any, [f, ...fs]: Func<_, _>[], done: Func<Options<_>, _>) => {
  if (O.is.Faulted(x)) void done(x);
  const something = tryCatch(f)(x);
  if (O.is.Faulted(something)) void done(something);
  else {
    const { value } = something;
    const stop = fs.length < 1;
    return isTask(value)
      ? stop
        ? value.then(done)
        : value.then(x => fold(x, fs, done))
      : stop
      ? done(something)
      : fold(value, fs, done);
  }
};

const create = <a, b>(
  trigger: (fa: Func<a, void>) => void,
  q: Func<_, _>[],
  does: (x: a) => (done: Func<Options<_>, _>) => void
): ContinuationDef<b> => ({
  pipe: bc => Continuation(trigger, q, bc as Join),
  then(done) {
    try {
      trigger(x => does(x)(done));
    } catch (fault) {
      done(Option<b>().Faulted({ fault }));
    }
  }
});

const Continuation = <a, b>(
  trigger: (f_: Func<a, void>) => void,
  init: Func<_, _ | TaskDef<_>>[],
  last: (x: a) => b
): ContinuationDef<b> => {
  const q: Func<_, _>[] = [...init, last];
  return create<a, b>(trigger, q, x => done => fold(x, q, done));
};

export const Task = <a>(
  trigger: (fa: Func<Options<a>, void>) => void
): TaskDef<a> => withSymbol(create(trigger, [], x => done => done(x)), Task$);
