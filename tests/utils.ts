import { Completion, Failure, Option } from '../@types';
import { allCompleted, isFaulted } from '../src';

export const expectFaulted = <a>(
  task: Option<a>[],
  t: any,
  test: (results: Failure[]) => PromiseLike<void> | void
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
