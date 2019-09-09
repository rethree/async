import { test } from 'tap';
import { List } from '../src';
import { asArray } from '../src/internal';
import { range } from './utils';

const { fromArray } = List;

const crazy = 50000;
const array = [...range(0, crazy)];
const list = fromArray(array);

test('enumeration is stack-safe', async t => {
  const stamp = Date.now();
  const out = [...asArray(list)];
  console.log(
    `enumerating over ${crazy} elements took ${Date.now() - stamp} ms`
  );

  t.equal(out.length - 1, crazy);
});
