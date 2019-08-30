import { Seq } from '../src';
import { test } from 'tap';

test("Nil's alg() is equal to its value", async t => {
  const [Nil] = Seq();
  const x = Nil();

  t.equal(x.alg(), x.value);
});

test('Non-nil sequence has its alg() equal to its value', async t => {
  const [Nil, Concat] = Seq();
  const x = Concat(4, Nil());

  t.equal(x.alg(), x.value);
});

test('Nil constructor creates a sequence of null', async t => {
  const [Nil] = Seq();
  const x = Nil();

  t.equal(x.alg(), null);
});

test('Nil constructor always points to another Nil', async t => {
  const [Nil] = Seq();
  const x = Nil();

  t.equal(x.next().done, true);
  t.equal(x.next().alg(), null);
});

test('Nil constructor always maps to another Nil', async t => {
  const [Nil] = Seq();
  const x = Nil();

  t.equal(x.map(x => x).done, true);
});

test('non-nil sequence does not start with done', async t => {
  const [Nil, Concat] = Seq<number>();
  const x = Concat(42, Nil());

  t.notEqual(x.done, true);
});

test('when mapped, non-nil sequence respects morphism provided', async t => {
  const [Nil, Concat] = Seq<number>();
  const x = Concat(9001, Concat(42, Nil()));
  const y = x.map(x => x + 5);

  t.equal(y.alg(), 9006);
});

test('when mapped, non-nil sequence preserves successors reference', async t => {
  const [Nil, Concat] = Seq<number>();
  const x = Concat(9001, Concat(42, Nil()));
  const y = x.map(x => x);

  t.equal(y.next(), x.next());
});

test('when mapped, non-nil sequence preserves the structure', async t => {
  const [Nil, Concat] = Seq<number>();
  const x = Concat(9001, Concat(42, Nil()));
  const y = x.map(x => x);

  t.same(y.next(), x.next());
});

test('nested sequence preserves values', async t => {
  const [Nil, Concat] = Seq<number>();
  const x = Concat(9001, Concat(12, Concat(42, Nil())));

  t.equal(x.alg(), 9001);
  t.equal(x.next().alg(), 12);
  t.equal(
    x
      .next()
      .next()
      .alg(),
    42
  );
});
