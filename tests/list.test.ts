import { test } from 'tap';
import { fromArray, List } from '../src';
import { asArray, cata, isEmpty } from '../src/utils';
import { range } from './utils';

const crazy = 50000;
const array = [...range(0, crazy)];
const list = fromArray(array);

test('List constructed with Empty() creates a list of null', async t => {
  const list = List();

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
  const list = List(9001, List(42, List(7, List(0))));

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
    const x = List(9001, List(42));
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

test('cata over numbers', async t => {
  const list = List(4, List(3, List(2, List(1))));
  const x = cata(list, (x, y) => x + y);

  t.equals(x, 10);
});

test('cata over functions', async t => {
  const inc = (x: number) => x + 1;
  const list = List(inc, List(inc, List(inc, List(inc))));
  const f = cata(list, (f0, f1) => x => f1(f0(x)));

  t.equals(f(0), 4);
});

test('cata over promises', async t => {
  type P = (x: number) => Promise<number>;

  const inc: P = x => Promise.resolve(x + 1);
  const list = List(inc, List(inc, List(inc, List(inc))));
  const f = cata(list, (fp0, fp1) => x => fp0(x).then(fp1));

  t.equals(await f(0), 4);
});

test('unfolding is stack-safe', async t => {
  const stamp = Date.now();
  const list = fromArray(array);
  console.log(`uncataing ${crazy} elements took ${Date.now() - stamp} ms`);

  t.equal(list.alg(), crazy);
});

test('folding is stack-safe', async t => {
  const stamp = Date.now();
  const scalar = cata(list, (y, x) => x + y);
  console.log(`cataing ${crazy} elements took ${Date.now() - stamp} ms`);

  t.equal(scalar, 1250025000);
});

test('mapping is stack-safe', async t => {
  const stamp = Date.now();
  const mapped = list.map(x => x + 1);
  console.log(`mapping over ${crazy} elements took ${Date.now() - stamp} ms`);
  const scalar = cata(mapped, (y, x) => x + y);

  t.equal(scalar, 1250025000 + crazy + 1);
});

test('enumeration is stack-safe', async t => {
  const stamp = Date.now();
  const out = [...asArray(list)];
  console.log(
    `enumerating over ${crazy} elements took ${Date.now() - stamp} ms`
  );

  t.equal(out.length - 1, crazy);
});
