import { test } from 'tap';
import { allCompleted, complete, fail, Task } from '../lib';
import { expectCompleted, expectFaulted } from './utils';

test('task should be tagged as "Completed" if resolved promise is provided', async t => {
  const res = await Task(Promise.resolve(42))();

  t.equal(allCompleted(res), true);
});

test('Succesful task should carry promise resolution value', async t => {
  const res = await Task(Promise.resolve(42))();

  expectCompleted(res, t, ([{ value }]) => t.equal(value, 42));
});

test('Succesful task should carry relevant metadata', async t => {
  const task = await Task(x => Promise.resolve(x))(42);

  expectCompleted(task, t, ([{ meta }]) => t.same(meta, { args: [42] }));
});

test('task should be tagged as "Faulted" if rejected promise is provided', async t => {
  const task = await Task(Promise.reject(42))();

  t.equal(allCompleted(task), false);
});

test('Faulted task should carry promise rejection reason', async t => {
  const task = await Task(Promise.reject(42))();

  expectFaulted(task, t, ([{ fault }]) => t.equal(fault, 42));
});

test('Faulted task should carry relevant metadata', async t => {
  const task = await Task(x => Promise.reject(x))(42);

  expectFaulted(task, t, ([{ meta }]) => t.same(meta, { args: [42] }));
});

test('task.complete creates a task from raw value', async t => {
  const task = await complete(42)();

  expectCompleted(task, t, ([{ value }]) => t.equal(value, 42));
});

test('task.complete creates a task from a promise', async t => {
  const task = await complete(Promise.resolve(42))();

  expectCompleted(task, t, ([{ value }]) => t.equal(value, 42));
});

test('task created with complete is lazy', async t => {
  const task = await complete(Promise.resolve(42))();

  expectCompleted(task, t, ([{ value }]) => t.equal(value, 42));
});

test('task.fail creates a task from raw value', async t => {
  const task = await fail(42)();

  expectFaulted(task, t, ([{ fault }]) => t.equal(fault, 42));
});
