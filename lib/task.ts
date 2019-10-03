import { O, Option } from "./options";
import { Func, Join, Options, _ } from "./types";
import { tryCatch } from "./utils";

const fold = (x: _, [f, ...fs]: Func<_, _>[], done: Func<Options<_>, _>) => {
  const something = tryCatch(f)(x);
  if (O.is.Faulted(something)) void done(something);
  else {
    const { value } = something;
    const stop = fs.length < 1;
    return value instanceof Task
      ? stop
        ? value.then(done)
        : value.then(x => fold(x, fs, done))
      : stop
      ? done(something)
      : fold(value, fs, done);
  }
};

class Continuation<a, b> {
  private readonly q: Func<_, _>[];

  constructor(
    private readonly trigger: (fn: Func<_, void>) => void,
    init: Func<_, _ | Task<_>>[],
    last: (x: a) => b
  ) {
    this.q = [...init, last];
  }

  pipe<c>(bc: Func<b, c | Task<c>>): Continuation<b, c> {
    return new Continuation(this.trigger, this.q, bc as Join);
  }

  then<c>(done: Func<Options<b>, c>) {
    try {
      this.trigger(x => fold(x, this.q, done));
    } catch (fault) {
      done(Option<b>().Faulted({ fault }));
    }
  }
}

export class Task<a> {
  constructor(private readonly trigger: (fn: (x: a) => void) => void) {}

  pipe<b>(ab: (x: a) => b | Task<b>): Continuation<a, b> {
    return new Continuation(this.trigger, [], ab as Join);
  }

  then<b>(done: Func<a, b>) {
    this.trigger(done);
  }
}
