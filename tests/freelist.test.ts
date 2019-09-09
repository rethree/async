import { test } from 'tap';
// import { AsyncTask, Done } from '../@types';
import { FreeList, Id } from '../src';
import { isEmpty, enumerate } from '../src/internal';
// import { range } from './utils';

const { Pure, Free } = FreeList;

// const crazy = 50000;
// const array = [...range(0, crazy)];
// const list = fromArray(array);

test('FreeListList constructed with Pure() creates a list of null', async t => {
  const free = Pure();

  t.equal(free.alg(), null);

  test('FreeListList constructed with Pure() reports 0-length', async t => {
    t.equal(free.len(), 0);
  });

  test('FreeListList constructed with Pure() always points to another Pure', async t => {
    const stillEmpty = free.succ();

    t.true(isEmpty(stillEmpty));
  });

  test('Pure always maps to another Pure', async t => {
    const stillEmpty = free.map(x => x);

    t.true(isEmpty(stillEmpty));
  });
});

test('FreeList constructed with Free() does not start with null', async t => {
  const free = Free(Id(9001), Free(Id(42)));

  t.equal(isEmpty(free), false);

  test('FreeList constructed with Free() ends with null', async t => {
    t.equal(isEmpty(free.succ().succ()), true);
  });

  test('when mapped, non-empty free preserves structure', async t => {
    const x = Free(Id(9001), Free(Id(42)));
    const y = x.map(x => x);

    t.same(y.succ(), x.succ());
  });

  test('when mapped, non-empty free preserves values', async t => {
    const x = Free(Id(7), Free(Id(0), Free(Id(9001), Free(Id(42)))));
    const y = [...enumerate(x.map(x => x))];

    t.same(y, [Id(7), Id(0), Id(9001), Id(42)]);
  });

  test('nested list preserves values', async t => {
    const x = Free(Id(9001), Free(Id(12), Free(Id(42))));

    t.same(x.alg(), Id(9001));
    t.same(x.succ().alg(), Id(12));
    t.same(
      x
        .succ()
        .succ()
        .alg(),
      Id(42)
    );
  });
});

test('Head reports correct length', async t => {
  const list = Free(Id(3), Free(Id(4), Free(Id(5), Free(Id(6)))));

  t.equal(list.len(), 4);

  test('Intermediate lists report correct length', async t => {
    const list = Free(Id(3), Free(Id(4), Free(Id(5), Free(Id(6)))));

    t.equal(
      list
        .succ()
        .succ()
        .len(),
      2
    );
  });
});
