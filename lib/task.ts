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
import { tryCatch } from "./utils";

const isTask = (x: any): x is TaskDef<_> => typeof x === "object" && Task$ in x;

const fold = (x: _, [f, ...fs]: Func<_, _>[], done: Func<Options<_>, _>) => {
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

const Continuation = <a, b>(
  trigger: (f_: Func<_, void>) => void,
  init: Func<_, _ | TaskDef<_>>[],
  last: (x: a) => b
): ContinuationDef<b> => {
  const q: Func<_, _>[] = [...init, last];

  return {
    pipe: bc => Continuation(trigger, q, bc as Join),
    then(done) {
      try {
        trigger(x => fold(x, q, done));
      } catch (fault) {
        done(Option<b>().Faulted({ fault }));
      }
    }
  };
};

export const Task = <a>(
  trigger: (fa: Func<Options<a>, void>) => void
): TaskDef<a> => {
  const instance: Omit<TaskDef<a>, typeof Task$> = {
    pipe: ab => Continuation(trigger, [], ab as Join),
    then(done) {
      try {
        trigger(done);
      } catch (fault) {
        done(Option<a>().Faulted({ fault }));
      }
    }
  };

  return Object.defineProperty(instance, Task$, {
    value: true,
    writable: false,
    configurable: false,
    enumerable: false
  });
};
