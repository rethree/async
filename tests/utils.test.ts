import { test } from 'tap';
import { lift, B } from '../src/utils';

test('lift wraps non-array value in an array', t => {
  const x = lift(42);

  t.deepEqual(x, [42]);
  t.done();
});

test('lift leaves array untouched', t => {
  const x = lift([42]);

  t.deepEqual(x, [42]);
  t.done();
});

test('B composes unary, homogenous functions from the right to the left', async t => {
  const f0 = (x: string) => x + '0';
  const f1 = (x: string) => x + '1';
  const f2 = (x: string) => x + '2';

  const x = B(f0, f1, f2)('a');

  t.equal(x, 'a210');
});
