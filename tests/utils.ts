import { Variant, Faulted, Succeeded } from '../@types';
import { isFaulted } from '../src';

export const expectFaulted = <a>(
  task: Variant<a>,
  t: any,
  test: (faulted: Faulted) => PromiseLike<void> | void
) => {
  if (isFaulted(task)) test(task);
  else t.fail('task is an unexpected (successful) state');
};

export const expectSucceeded = <a>(
  task: Variant<a>,
  t: any,
  test: (succeeded: Succeeded<a>) => PromiseLike<void> | void
) => {
  if (!isFaulted(task)) test(task);
  else t.fail('task is an unexpected (faulted) state');
};
