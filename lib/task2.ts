import { Func, Join, _ } from "./types";
import { tryCatch } from "./utils";
import { Option } from "./options";

const fold = (x: _, [fx, ...fs]: Func<_, _>[]) => {
  const y = fx(x);
  return fs.length > 0 ? fold(y, fs) : y;
};

class Continuation<a, b> {
  private readonly q: Func<_, _>[];

  constructor(
    private readonly trigger: (fn: (x: _) => void) => void,
    init: Func<_, _ | Task<_>>[],
    last: (x: a) => b
  ) {
    this.q = [...init, last];
  }

  then<c>(bc: (y: b) => c | Task<c>): Continuation<b, c> {
    return new Continuation(this.trigger, this.q, bc as Join);
  }

  run(complete = Function.prototype) {
    try {
      this.trigger(x => complete(tryCatch(fold)(x, this.q)));
    } catch (fault) {
      complete(Option<b>().Faulted({ fault }));
    }
  }
}

export class Task<a> {
  constructor(private readonly trigger: (fn: (x: a) => void) => void) {}

  then<b>(ab: (x: a) => b | Task<b>): Continuation<a, b> {
    return new Continuation(this.trigger, [], ab as Join);
  }

  run(complete = Function.prototype) {
    this.trigger(complete as any);
  }
}
