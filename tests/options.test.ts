import { test } from 'tap';
import { Faulted, isFaulted, Completed, allCompleted } from '../lib';
import { Option } from '../lib/types';

test('isFaulted detects faulted variant', async t => {
  const fault = Faulted(Error('42'));

  t.true(isFaulted(fault[0]));
});

test('allCompleted detects failures withing mixed results', async t => {
  const xs = [...Faulted(Error('42')), ...Completed(42)];

  t.false(allCompleted(xs));
});

test('allCompleted detects failures withing failed results', async t => {
  const xs = [...Faulted(Error('42')), ...Faulted(42)];

  t.false(allCompleted(xs));
});

test('allCompleted detects complete-only results', async t => {
  const xs: Option<any>[] = [...Completed('9001'), ...Completed(42)];

  t.true(allCompleted(xs));
});
