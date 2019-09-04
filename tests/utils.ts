import { Done, Faulted, Variant } from '../@types';
import { isFaulted } from '../src';

export const expectFaulted = <a>(
  task: Variant<a>,
  t: any,
  test: (faulted: Faulted) => PromiseLike<void> | void
) => {
  if (isFaulted(task)) test(task);
  else t.fail('task is in an unexpected (successful) state');
};

export const expectDone = <a>(
  task: Variant<a>,
  t: any,
  test: (done: Done<a>) => PromiseLike<void> | void
) => {
  if (!isFaulted(task)) test(task);
  else t.fail('task is in an unexpected (faulted) state');
};

export function* range(x: number, y: number) {
  for (let i = x; i <= y; i++) {
    yield i;
  }
}
