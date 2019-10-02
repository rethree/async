import { _, Func, Join } from "./types";
import { Option } from "./options";

const O = Option();

class Continuation<a, b> {
  private readonly q: Func<_, _>[];

  constructor(
    private readonly trigger: (fn: (x: _) => void) => void,
    private readonly init: Func<_, _ | Task<_>>[],
    private readonly last: (x: a) => b
  ) {
    this.q = [...init, last];
  }

  then<c>(bc: (y: b) => c | Task<c>): Continuation<b, c> {
    return new Continuation(
      this.trigger,
      [this.last, ...this.init],
      bc as Join
    );
  }

  run() {
    const [head, ...tail] = this.q;
    const start = this.trigger(head);
    for (const xf of tail) {
    }
    this.trigger(this.q.reduce((acc, head) => (x: _) => {}));
  }
}

export class Task<a> {
  constructor(private trigger: (fn: (x: a) => void) => void) {}

  then<b>(ab: (x: a) => b | Task<b>): Continuation<a, b> {
    return new Continuation(this.trigger, [], ab as Join);
  }

  run() {
    this.trigger(Function.prototype as any);
  }
}
