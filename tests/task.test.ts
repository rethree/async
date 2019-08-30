import { test } from 'tap';
import { isFaulted, Task } from '../src';
import { expectFaulted, expectSucceeded } from './utils';

test('task should be tagged as "Succeeded" if resolved promise is provided', async t => {
  const task = await Task(Promise.resolve(42))();
  t.equal(!isFaulted(task), true);
});

test('Succesful task should carry promise resolution value', async t => {
  const task = await Task(Promise.resolve(42))();

  expectSucceeded(task, t, ({ value }) => t.equal(value, 42));
});

test('Succesful task should carry relevant metadata', async t => {
  const task = await Task(x => Promise.resolve(x), 42)();

  expectSucceeded(task, t, ({ meta }) => t.same(meta, { args: [42] }));
});

test('task should be tagged as "Faulted" if rejected promise is provided', async t => {
  const task = await Task(Promise.reject(42))();

  t.equal(isFaulted(task), true);
});

test('Faulted task should carry promise rejection reason', async t => {
  const task = await Task(Promise.reject(42))();

  expectFaulted(task, t, ({ error }) => t.equal(error, 42));
});

test('Faulted task should carry relevant metadata', async t => {
  const task = await Task(x => Promise.reject(x), 42)();

  expectFaulted(task, t, ({ meta }) => t.same(meta, { args: [42] }));
});

test('test.from creates a task from raw value', async t => {
  const task = await Task.from(42)();

  expectSucceeded(task, t, ({ value }) => t.equal(value, 42));
});

test('test.from creates a task from a promise', async t => {
  const task = await Task.from(Promise.resolve(42))();

  expectSucceeded(task, t, ({ value }) => t.equal(value, 42));
});

test('test.faulted creates a task from raw value', async t => {
  const task = await Task.faulted(42)();

  expectFaulted(task, t, ({ error }) => t.equal(error, 42));
});
