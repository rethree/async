import { _, Nil } from "./types";

const Empty = undefined;

class Sequence<a, b, c> {
  constructor(public init: Sequence<_, a, b> | Nil, public f: (x: b) => c) {}

  append<d>(cd: (y: c) => d) {
    return new Sequence(this, cd);
  }
}

class Continuation<a, b> {
  constructor(
    private f: (complete: (x: _) => void) => void,
    private seq: Sequence<_, a, b>
  ) {}

  then<c>(bc: (y: b | Task2<b>) => c | Task2<c>) {
    return new Continuation(this.f, new Sequence(this.seq, bc));
  }
}

export class Task2<a> {
  constructor(private f: (complete: (x: a) => void) => void) {}

  then<b>(ab: (x: a) => b | Task2<b>) {
    return new Continuation(this.f, new Sequence(Empty, ab));
  }

  exec() {}
}

const x = new Task2(complete => {
  setTimeout(() => complete(42), 100);
});

const s = new Sequence(
  new Sequence<_, number, number>(Empty, x => x + 5),
  x => x + 32
);
