import { O, Option } from "./options";
import { TaskDef, Func, Options, Task$, Xf, _ } from "./types";
import { withSymbol } from "./utils";

const isThenable = (x: any): x is PromiseLike<_> =>
  typeof x === "object" && "then" in x && typeof x.then === "function";

const evaluate = async (x: _, [f, ...fs]: Xf[], done: Func<Options<_>, _>) => {
  try {
    const something = f(x);
    const maybeOption = isThenable(something)
      ? await something
      : (something as any);
    O.match(maybeOption, {
      Faulted: _ => done(maybeOption),
      Completed: ({ value }) => {
        fs.length > 0 ? evaluate(value, fs, done) : done(maybeOption);
      },
      default: value => {
        fs.length > 0
          ? evaluate(value, fs, done)
          : done(O.Completed({ value }));
      }
    });
  } catch (fault) {
    done(O.Faulted({ fault }));
  }
};

const task = <a>(action: (fa: Func<_, void>) => void, q: Xf[]): TaskDef<a> => ({
  map: ab => task(action, [...q, ab]),
  chain: atb => task(action, [...q, atb]),
  then(done) {
    try {
      action(x => evaluate(x, q, done));
    } catch (fault) {
      done(Option<a>().Faulted({ fault }));
    }
  }
});

export const Task = <a>(action: (fa: Func<a, void>) => void): TaskDef<a> => {
  const Opt = Option<a>();
  return withSymbol(
    {
      ...task(action, []),
      then: (done: Func<Options<a>, _>) => {
        try {
          action(value => {
            done(Opt.Completed({ value }));
          });
        } catch (fault) {
          done(Opt.Faulted({ fault }));
        }
      }
    },
    Task$
  );
};
