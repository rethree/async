import { O, Option } from "./options";
import { ContinuationDef, Func, Options, Task$, TaskDef, _ } from "./types";
import { tryCatch, withSymbol } from "./utils";

const isTask = (x: any): x is TaskDef<_> => typeof x === "object" && Task$ in x;

const parse = (x: any, [f, ...fs]: Func<_, _>[], done: Func<Options<_>, _>) => {
  if (O.is.Faulted(x)) void done(x);
  const something = tryCatch(f)(x);
  if (O.is.Faulted(something)) {
    void done(something)
  }
  else {
    const { value } = something;
    const stop = fs.length < 1;
    return isTask(value)
      ? stop
        ? value.then(done)
        : value.then(x => parse(x, fs, done))
      : stop
        ? done(something)
        : parse(value, fs, done);
  }
};

const task = <a> (
  action: (fa: Func<_, void>) => void,
  q: Func<_, _>[]
): ContinuationDef<a> => ({
  map: ab => task(action, [...q, ab]),
  chain: atb => task(action, [...q, atb]),
  then (done) {
    try {
      action(x => parse(x, q, done));
    } catch (fault) {
      done(Option<a>().Faulted({ fault }));
    }
  }
});

export const Task = <a> (
  action: (fa: Func<Options<a>, void>) => void
): TaskDef<a> => withSymbol(task<a>(action, []), Task$);

(async () => {
  const t = Task(fx => {
    setTimeout(() => fx(10), 100);
  })
    .map(x => x + 10)
    .chain(x => Task(fx => {
      setTimeout(() => fx(x + 9000), 100)
    })).chain(x => Task(fx => {
      console.log(x)
      setTimeout(() => fx(x + 100), 100)
    })).chain(x => Task(fx => {
      throw Error(42)
      console.log(x)
      queueMicrotask(() => fx(x - 99))
    }))
    .map(x => x + 23)

  // t.then(console.log)
  const x = await t;
  console.log(x)

  // t.then(console.log);
})()