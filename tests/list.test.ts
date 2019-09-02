import { only, test } from 'tap';
import { Cata, Enumerator, Ana, isNil, List } from '../src';
import { range } from './utils';

const crazy = 50000;
const array = [...range(0, crazy)];

test('Nil constructor creates a sequence of null', async t => {
  const [, Nil] = List();
  const x = Nil();

  t.equal(x.alg(), null);
});

test('Nil constructor always points to another Nil', async t => {
  const [, Nil] = List();
  const x = Nil();

  t.true(isNil(x));
});

test('Nil constructor always maps to another Nil', async t => {
  const [, Nil] = List();
  const x = Nil();
  const y = x.map(x => x);

  t.true(isNil(y));
});

test('non-nil sequence does not start with done', async t => {
  const [Succ, Nil] = List<number>();
  const x = Succ(42, Nil());

  t.equal(isNil(x), false);
});

test('non-nil sequence ends with done', async t => {
  const [Succ, Nil] = List<number>();
  const x = Succ(9001, Succ(42, Nil()));

  t.equal(isNil(x.succ().succ()), true);
});

test('when mapped, non-nil sequence respects morphism provided', async t => {
  const [Succ, Nil] = List<number>();
  const x = Succ(9001, Succ(42, Nil()));
  const y = x.map(x => x + 5);

  t.equal(y.alg(), 9006);
});

test('when mapped, non-nil sequence preserves successors reference', async t => {
  const [Succ, Nil] = List<number>();
  const x = Succ(9001, Succ(42, Nil()));
  const y = x.map(x => x);

  t.equal(y.succ(), x.succ());
});

test('when mapped, non-nil sequence preserves the structure', async t => {
  const [Succ, Nil] = List<number>();
  const x = Succ(9001, Succ(42, Nil()));
  const y = x.map(x => x);

  t.same(y.succ(), x.succ());
});

test('nested sequence preserves.alg()s', async t => {
  const [Succ, Nil] = List<number>();
  const x = Succ(9001, Succ(12, Succ(42, Nil())));

  t.equal(x.alg(), 9001);
  t.equal(x.succ().alg(), 12);
  t.equal(
    x
      .succ()
      .succ()
      .alg(),
    42
  );
});

test('Succ(x, Nil) is equivalent to Init(x) alg()', async t => {
  const [Init] = List();
  const x = Init(3);
  const nil = x.succ();

  t.true(isNil(nil));
  t.equal(isNil(x), false);
  t.equal(x.alg(), 3);
});

test('cata over numbers', async t => {
  const [Succ] = List<number>();
  const seq = Succ(4, Succ(3, Succ(2, Succ(1))));
  const x = Cata(seq, (x, y) => x + y);

  t.equals(x, 10);
});

only('cata over functions', async t => {
  const inc = (x: number) => x + 1;
  const [Succ] = List<(x: number) => number>();
  const seq = Succ(inc, Succ(inc, Succ(inc, Succ(inc))));
  const f = Cata(seq, (f0, f1) => x => f1(f0(x)));

  t.equals(f(0), 4);
});

test('cata over promises', async t => {
  type P = (x: number) => Promise<number>;

  const inc: P = x => Promise.resolve(x + 1);
  const [Succ] = List<P>();
  const seq = Succ(inc, Succ(inc, Succ(inc, Succ(inc))));
  const f = Cata(seq, (fp0, fp1) => x => fp0(x).then(fp1));

  t.equals(await f(0), 4);
});

test('unfolding is stack-safe', async t => {
  const stamp = Date.now();
  const list = Ana<number>(array);
  console.log(`unfolding took ${Date.now() - stamp} ms`);

  t.equal(list.alg(), crazy);
});

test('folding is stack-safe', async t => {
  const list = Ana<number>(array);
  const stamp = Date.now();
  const scalar = Cata(list, (y, x) => x + y);
  console.log(`folding took ${Date.now() - stamp} ms`);

  t.equal(scalar, 1250025000);
});

test('enumeration is stack-safe', async t => {
  const list = Ana<number>(array);
  const stamp = Date.now();
  const out = [...Enumerator(list)];
  console.log(`enumeration  took ${Date.now() - stamp} ms`);

  t.equal(out.length - 1, crazy);
});
