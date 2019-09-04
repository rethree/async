import { test } from 'tap';
import { rec } from '../src';

test('Rec recursively applies function provided', async t => {
  const run = rec<number, [number]>(
    step =>
      function rec(acc, n) {
        return n > 0 ? step(() => rec(acc + n, n - 1)) : acc;
      }
  );

  t.equal(run(0, 100), 5050);
});

test('Rec is stack-safe', async t => {
  const run = rec<number, [number]>(
    step =>
      function rec(acc, n) {
        return n > 0 ? step(() => rec(acc, n - 1)) : acc;
      }
  );

  t.equal(run(0, 100000), 0);
});

test('Rec can handle function iteration', async t => {
  const run = rec<(x: number) => number, [((x: number) => number)[]]>(
    step =>
      function rec(acc, [hd, ...tl]) {
        return hd ? step(() => rec(x => hd(acc(x)), tl)) : acc;
      }
  );

  const inc = (x: number) => x + 1;

  t.equal(run(inc, [inc, inc, inc])(0), 4);
});
