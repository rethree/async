import * as delay from 'delay';
import { test } from 'tap';
import { Completion } from '../@types';
import { complete, fail, lift, Parallel, Task, isFaulted } from '../src';
import { expectCompleted, expectFaulted } from './utils';

const measure = () =>
  Task(async () => {
    const before = Date.now();
    await delay(1000);
    const after = Date.now();
    return [before, after];
  });

// Can't guarantee that because of the nature of parallelism, thankfully if it
// succeeds just once the evidence is there.
test('tasks run with Parallel are being run simultaneously, likely', async t => {
  const task = Parallel(measure(), measure(), measure());
  const stamps = (await task()) as Completion<number[]>[];
  const [parallel] = stamps.reduce<[boolean, { value: number[] }]>(
    ([acc, s0], s1) => [acc && s0.value[1] > s1.value[0], s1],
    [true, { value: [0, Date.now()] }]
  );
  t.true(parallel);
});

test('the amount of results returned is equal to the amount of tasks provided', async t => {
  const res = await Parallel<any>(complete(42), fail(9001), complete('sup'))();

  t.equal(res.length, 3);
});

test('successful tasks results are being carried over', async t => {
  const res = await Parallel(complete(42), complete(9001))();

  expectCompleted(res, t, ([{ value }]) => t.equal(value, 42));
});

test('faulted tasks results are being carried over', async t => {
  const res = await Parallel(fail(42), fail(9001))();

  expectFaulted(res, t, errors => {
    t.equal(errors.length, 2);
    t.ok(errors.some(({ error }) => error.message === '42'));
    t.ok(errors.some(({ error }) => error.message === '9001'));
  });
});

test('mixed-results tasks results are being carried over', async t => {
  const task = await Parallel(fail(42), complete(9001))();

  expectFaulted(task.filter(isFaulted), t, ([{ error }]) =>
    t.equal(error.message, '42')
  );
  expectCompleted(task.filter(x => !isFaulted(x)), t, ([{ value }]) =>
    t.equal(value, 9001)
  );
});

test('lift wraps non-array value in an array', async t => {
  const x = lift(42);

  t.deepEqual(x, [42]);
});

test('lift leaves array untouched', async t => {
  const x = lift([42]);

  t.deepEqual(x, [42]);
});
