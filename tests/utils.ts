import { Completion, Option, Fault } from '../@types';
import { allCompleted, isFaulted } from '../src';

export const expectFaulted = <a>(
  task: Option<a>[],
  t: any,
  test: (results: Fault[]) => PromiseLike<void> | void
) => {
  if (!allCompleted(task)) test(task.filter(isFaulted));
  else t.fail('task is in an unexpected (successful) state');
};

export const expectCompleted = <a>(
  task: Option<a>[],
  t: any,
  test: (completed: Completion<a>[]) => PromiseLike<void> | void
) => {
  if (allCompleted(task)) test(task);
  else t.fail('task is in an unexpected (faulted) state');
};

export function* range(x: number, y: number) {
  for (let i = x; i <= y; i++) {
    yield i;
  }
}
