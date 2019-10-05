import { O, Option } from "./options";
import { TaskDef, Func, Options, Task$, Xf, _ } from "./types";
import { withSymbol } from "./utils";

const evaluate = async (
  x: _,
  [[f, blocking, resumable], ...fs]: Xf[],
  done: Func<Options<_>, _>
) => {
  try {
    const something = f(x);
    const maybeOption = blocking ? await something : (something as any);
    const active = fs.length > 0;

    O.match(maybeOption, {
      Faulted: _ =>
        resumable && active
          ? evaluate(maybeOption, fs, done)
          : done(maybeOption),
      Completed: ({ value }) =>
        void active ? evaluate(value, fs, done) : done(maybeOption),
      default: value =>
        void active ? evaluate(value, fs, done) : done(O.Completed({ value }))
    });
  } catch (fault) {
    done(O.Faulted({ fault }));
  }
};

const task = <a>(action: (fa: Func<_, void>) => void, q: Xf[]): TaskDef<a> => ({
  map: (ab, resume) => task(action, [...q, [ab, false, resume]]),
  chain: (atb, resume) => task(action, [...q, [atb, true, resume]]),
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
