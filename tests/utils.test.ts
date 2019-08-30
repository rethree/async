import { test } from 'tap';
import { lift } from '../src/utils/array';

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
