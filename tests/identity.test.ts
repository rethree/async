import { test } from 'tap';
import { Id } from '../src';

test('Identity is an f-algebra', async t => {
  const id = Id(42);
  const x = id.alg();

  t.equal(x, 42);
  t.equal(id.map().alg(), 42);
});

test('Identity respects laziness', async t => {
  const id = Id(() => 42);
  const x = id.alg();

  t.equal(x, 42);
  t.equal(id.map().alg(), 42);
});
