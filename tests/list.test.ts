import { test } from 'tap';
import { AsyncTask, Done } from '../@types';
import { Id, List, Success, Task } from '../src';
import { isEmpty } from '../src/internal';
import { range } from './utils';

const { fromArray, Empty, Cons, fold } = List;

const crazy = 50000;
const array = [...range(0, crazy)];
const list = fromArray(array);

test('List constructed with Empty() creates a list of null', async t => {
  const list = Empty();

  t.equal(list.alg(), null);

  test('List constructed with Empty() reports 0-length', async t => {
    t.equal(list.len(), 0);
  });

  test('List constructed with Empty() always points to another Empty', async t => {
    const stillEmpty = list.succ();

    t.true(isEmpty(stillEmpty));
  });

  test('Empty constructor always maps to another Empty', async t => {
    const stillEmpty = list.map(x => x);

    t.true(isEmpty(stillEmpty));
  });
});

test('List constructed with Cons() does not start with null', async t => {
  const list = Cons(9001, Cons(42, Cons(7, Cons(0))));

  t.equal(isEmpty(list), false);

  test('List constructed with Cons() ends with null', async t => {
    t.equal(
      isEmpty(
        list
          .succ()
          .succ()
          .succ()
          .succ()
      ),
      true
    );
  });

  test('when mapped, non-empty list preserves structure', async t => {
    const x = Cons(9001, Cons(42));
    const y = x.map(x => x);

    t.same(y.succ(), x.succ());
  });

  test('nested list preserves values', async t => {
    t.equal(list.alg(), 9001);
    t.equal(list.succ().alg(), 42);
    t.equal(
      list
        .succ()
        .succ()
        .alg(),
      7
    );
  });

  test('Head reports correct length', async t => {
    t.equal(list.len(), 4);
  });

  test('Intermediate lists report correct length', async t => {
    t.equal(
      list
        .succ()
        .succ()
        .len(),
      2
    );
  });
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
  const f = fold(seq, (fp0, fp1) => x =>
    Id(() => fp0(x)().then(y => fp1(y as Done<number>)()))
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
