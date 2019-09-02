import { test } from 'tap';
import { trampoline } from '../src';

test('Trampoline recursively applies function provided', async t => {
  const run = trampoline<number, [number]>(
    jump =>
      function rec(acc, n) {
        return n > 0 ? jump(() => rec(acc + n, n - 1)) : acc;
      }
  );

  t.equal(run(0, 100), 5050);
});

test('Trampoline is stack-safe', async t => {
  const run = trampoline<number, [number]>(
    jump =>
      function rec(acc, n) {
        return n > 0 ? jump(() => rec(acc, n - 1)) : acc;
      }
  );

  t.equal(run(0, 100000), 0);
});

test('Trampoline can handle function iteration', async t => {
  const run = trampoline<(x: number) => number, [((x: number) => number)[]]>(
    jump =>
      function rec(acc, [hd, ...tl]) {
        return hd ? jump(() => rec(x => hd(acc(x)), tl)) : acc;
      }
  );

  const inc = (x: number) => x + 1;

  t.equal(run(inc, [inc, inc, inc])(0), 4);
});
