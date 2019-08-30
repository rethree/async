import { test } from 'tap';
import { Cata, Seq } from '../src';
import { B } from '../src/utils';

test("Nil's alg() is equal to its value", async t => {
  const [Nil] = Seq();
  const x = Nil();

  t.equal(x.alg(), x.value);
});

test('Non-nil sequence has its alg() equal to its value', async t => {
  const [Nil, Succ] = Seq();
  const x = Succ(4, Nil());

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
  const y = x.map(x => x);

  t.equal(y.done, true);
  t.equal(y.next().alg(), null);
});

test('non-nil sequence does not start with done', async t => {
  const [Nil, Succ] = Seq<number>();
  const x = Succ(42, Nil());

  t.equal(x.done, false);
});

test('non-nil sequence ends with done', async t => {
  const [Nil, Succ] = Seq<number>();
  const x = Succ(9001, Succ(42, Nil()));

  t.equal(x.next().next().done, true);
});

test('when mapped, non-nil sequence respects morphism provided', async t => {
  const [Nil, Succ] = Seq<number>();
  const x = Succ(9001, Succ(42, Nil()));
  const y = x.map(x => x + 5);

  t.equal(y.alg(), 9006);
});

test('when mapped, non-nil sequence preserves successors reference', async t => {
  const [Nil, Succ] = Seq<number>();
  const x = Succ(9001, Succ(42, Nil()));
  const y = x.map(x => x);

  t.equal(y.next(), x.next());
});

test('when mapped, non-nil sequence preserves the structure', async t => {
  const [Nil, Succ] = Seq<number>();
  const x = Succ(9001, Succ(42, Nil()));
  const y = x.map(x => x);

  t.same(y.next(), x.next());
});

test('nested sequence preserves values', async t => {
  const [Nil, Succ] = Seq<number>();
  const x = Succ(9001, Succ(12, Succ(42, Nil())));

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

test('cata over numbers', async t => {
  const [Nil, Succ] = Seq<number>();
  const seq = Succ(4, Succ(3, Succ(2, Succ(1, Nil()))));
  const x = Cata(seq, (x, y) => x + y, 0);

  t.equals(x, 10);
});

test('cata over functions', async t => {
  const inc = (x: number) => x + 1;
  const [Nil, Succ] = Seq<(x: number) => number>();
  const seq = Succ(inc, Succ(inc, Succ(inc, Succ(inc, Nil()))));
  const f = Cata(seq, (f0, f1) => B(f0, f1), inc);

  t.equals(f(0), 5);
});

test('cata over promises', async t => {
  type P = (x: number) => Promise<number>;

  const inc: P = x => Promise.resolve(x + 1);
  const [Nil, Succ] = Seq<P>();
  const seq = Succ(inc, Succ(inc, Succ(inc, Succ(inc, Nil()))));
  const f = Cata(seq, (fp0, fp1) => x => fp0(x).then(fp1), inc);
  const x = await f(0);

  t.equals(x, 5);
});
