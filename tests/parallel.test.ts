import * as delay from 'delay';
import { test } from 'tap';
import { Done } from '../@types';
import { Parallel, Task } from '../src';
import { Success } from '../src/variants';
import { expectFaulted, expectDone } from './utils';

const measured = () => async () => {
  const before = Date.now();
  await delay(1000);
  const after = Date.now();
  return Success({})([before, after]);
};

// Can't guarantee that because of the nature of parallelism, thankfully if it
// succeeds just once the evidence is there.
test('tasks run with Parallel are being run simultaneously, likely', async t => {
  const task = Parallel(measured(), measured(), measured());
  const stamps = (await task()) as Done<number[]>[];
  const [parallel] = stamps.reduce<[boolean, { value: number[] }]>(
    ([acc, s0], s1) => [acc && s0.value[1] > s1.value[0], s1],
    [true, { value: [0, Date.now()] }]
  );
  t.true(parallel);
});

test('the amount of results returned is equal to the amount of tasks provided', async t => {
  const task = await Parallel<any>(
    Task.from(42),
    Task.faulted(9001),
    Task.from('sup')
  )();

  t.equal(task.length, 3);
});

test('successful tasks results are being carried over', async t => {
  const task = await Parallel(Task.from(42), Task.from(9001))();

  expectDone(task[0], t, ({ value }) => t.equal(value, 42));
});

test('faulted tasks results are being carried over', async t => {
  const task = await Parallel(Task.faulted(42), Task.faulted(9001))();

  expectFaulted(task[0], t, ({ error }) => t.equal(error, 42));
  expectFaulted(task[1], t, ({ error }) => t.equal(error, 9001));
});

test('mixed-results tasks results are being carried over', async t => {
  const task = await Parallel(Task.faulted(42), Task.from(9001))();

  expectFaulted(task[0], t, ({ error }) => t.equal(error, 42));
  expectDone(task[1], t, ({ value }) => t.equal(value, 9001));
});
