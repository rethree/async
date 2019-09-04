import { test } from 'tap';
import { AsyncTask, Done } from '../@types';
import { isEmpty, List } from '../src';
import { range } from './utils';

const { fromArray, Empty, Cons, enumerate, fold } = List;

const crazy = 50000;
const array = [...range(0, crazy)];
const list = fromArray(array);

test('List constructed with Empty() creates a list of null', async t => {
  const empty = Empty();

  t.equal(empty.alg(), null);
});

test('List constructed with Empty() reports 0-length', async t => {
  const list = Empty();

  t.equal(list.len(), 0);
});

test('List constructed with Empty() always points to another Empty', async t => {
  const empty = Empty();
  const stillEmpty = empty.succ();

  t.true(isEmpty(stillEmpty));
});

test('Empty constructor always maps to another Empty', async t => {
  const { Empty } = List;
  const empty = Empty();
  const stillEmpty = empty.map(x => x);

  t.true(isEmpty(stillEmpty));
});

test('List constructed with Cons() does not start with null', async t => {
  const list = Cons(42, Empty());

  t.equal(isEmpty(list), false);
});

test('List constructed with Cons() ends with null', async t => {
  const list = Cons(9001, Cons(42));

  t.equal(isEmpty(list.succ().succ()), true);
});

test('when mapped, non-empty list respects morphism provided', async t => {
  const x = Cons(9001, Cons(42));
  const y = x.map(x => x + 5);

  t.equal(y.alg(), 9006);
});

test('when mapped, non-empty list preserves successors reference', async t => {
  const x = Cons(9001, Cons(42));
  const y = x.map(x => x);

  t.same(y.succ(), x.succ());
});

test('when mapped, non-empty list preserves structure', async t => {
  const x = Cons(9001, Cons(42));
  const y = x.map(x => x);

  t.same(y.succ(), x.succ());
});

test('when mapped, non-empty list preserves values', async t => {
  const x = Cons(7, Cons(0, Cons(9001, Cons(42))));
  const y = [...enumerate(x.map(x => x))];

  t.same(y, [7, 0, 9001, 42]);
});

test('nested list preserves values', async t => {
  const x = Cons(9001, Cons(12, Cons(42, Empty())));

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

test('Head reports correct length', async t => {
  const list = Cons(3, Cons(4, Cons(5, Cons(6))));

  t.equal(list.len(), 4);
});

test('Intermediate lists report correct length', async t => {
  const list = Cons(3, Cons(4, Cons(5, Cons(6))));

  t.equal(
    list
      .succ()
      .succ()
      .len(),
    2
  );
});

test('fold over numbers', async t => {
  const seq = Cons(4, Cons(3, Cons(2, Cons(1))));
  const x = fold(seq, (x, y) => x + y);

  t.equals(x, 10);
});

test('fold over functions', async t => {
  const inc = (x: number) => x + 1;
  const { Cons, fold } = List;
  const seq = Cons(inc, Cons(inc, Cons(inc, Cons(inc))));
  const f = fold(seq, (f0, f1) => x => f1(f0(x)));

  t.equals(f(0), 4);
});

test('fold over promises', async t => {
  type P = (x: number) => Promise<number>;

  const inc: P = x => Promise.resolve(x + 1);
  const { Cons, fold } = List;
  const seq = Cons(inc, Cons(inc, Cons(inc, Cons(inc))));
  const f = fold(seq, (fp0, fp1) => x => fp0(x).then(fp1));

  t.equals(await f(0), 4);
});

test('fold over tasks', async t => {
  type P = (x: Done<number>) => AsyncTask<number>;

  const inc: P = x => Task.from(x.value + 1);
  const { Cons, fold } = List;
  const seq = Cons(inc, Cons(inc, Cons(inc, Cons(inc))));
  const f = fold(seq, (fp0, fp1) => x => () =>
    fp0(x)().then(y => fp1(y as Done<number>)())
  );

  const { value } = (await f(Success({})(0))()) as Done<number>;

  t.equals(value, 4);
});

test('unfolding is stack-safe', async t => {
  const stamp = Date.now();
  const list = fromArray(array);
  console.log(`unfolding ${crazy} elements took ${Date.now() - stamp} ms`);

  t.equal(list.alg(), crazy);
});

test('folding is stack-safe', async t => {
  const stamp = Date.now();
  const scalar = fold(list, (y, x) => x + y);
  console.log(`folding ${crazy} elements took ${Date.now() - stamp} ms`);

  t.equal(scalar, 1250025000);
});

test('mapping is stack-safe', async t => {
  const stamp = Date.now();
  const mapped = list.map(x => x + 1);
  console.log(`mapping over ${crazy} elements took ${Date.now() - stamp} ms`);
  const scalar = fold(mapped, (y, x) => x + y);

  t.equal(scalar, 1250025000 + crazy + 1);
});

test('enumeration is stack-safe', async t => {
  const stamp = Date.now();
  const out = [...enumerate(list)];
  console.log(
    `enumerating over ${crazy} elements took ${Date.now() - stamp} ms`
  );

  t.equal(out.length - 1, crazy);
});
