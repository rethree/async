import { test } from 'tap';
import { Faulted, isFaulted } from '../src';

test('isFaulted detects faulted variant', async t => {
  const fault = Faulted(Error('42'));

  t.true(isFaulted(fault[0]));
});
