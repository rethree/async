import T from 'tap';
import { complete, fail, Continuation, apply } from '../src';
import delay = require('delay');

T.jobs = 8;

const { test } = T;

test('chained extend is lazy, likely', async t => {
  const effects = new Map<number, number>();

  Continuation(complete(10))
    .extend(wa => {
      effects.set(0, Date.now());
      return wa().then(complete('a'));
    })
    .extend(wb => {
      effects.set(1, Date.now());
      return wb().then(fail(12));
    });

  await delay(1000);

  t.equal(effects.size, 0);
});

test('chained pipe is lazy, likely', async t => {
  const effects = new Map<number, number>();

  Continuation(complete(10))
    .pipe(_ => {
      effects.set(0, Date.now());
      return complete('a');
    })
    .pipe(_ => {
      effects.set(1, Date.now());
      return fail(12);
    });

  await delay(1000);

  t.equal(effects.size, 0);
});

test('suceeding map with extend will not trigger the latter', async t => {
  const effects = new Map<number, number>();

  Continuation(complete(10))
    .map(_ => {
      effects.set(2, Date.now());
      return complete(10);
    })
    .map(_ => {
      effects.set(1, Date.now());
      return complete(12);
    })
    .extend(wa => {
      effects.set(0, Date.now());
      return wa().then(complete('a'));
    });

  await delay(1000);

  t.equal(effects.size, 2);
});

test('extracting from a extend-blocked, but otherwise mapped Pipe will unblock it', async t => {
  const piped = await Continuation(complete(10))
    .map(_ => complete(10))
    .map(_ => fail(12))
    .extend(wa => wa().then(complete('a')))();

  t.equal(piped[0]['fault'], 12);
});

test('suceeding map with pipe will not trigger the latter, likely', async t => {
  const effects = new Map<number, number>();

  Continuation(complete(10))
    .map(_ => {
      effects.set(2, Date.now());
      return complete(10);
    })
    .map(_ => {
      effects.set(1, Date.now());
      return complete(12);
    })
    .pipe(_ => {
      effects.set(0, Date.now());
      return complete('a');
    });

  await delay(1000);

  t.equal(effects.size, 2);
});

test('extracting from a pipe-blocked, but otherwise mapped Pipe will unblock it', async t => {
  const piped = await Continuation(complete(10))
    .map(_ => complete(10))
    .map(_ => fail(12))
    .pipe(([x]) => complete(x.value + 8))();

  t.equal(piped[0]['fault'], 12);
});

test('succeeding extend with map will trigger the first', async t => {
  const effects = new Map<number, number>();

  Continuation(complete(5))
    .extend(wa => wa().then(apply(([x]) => complete(x.value + 5))))
    .extend(wa => wa().then(apply(([x]) => complete(x.value + 10))))
    .map(([x]) => {
      effects.set(1, x.value + 10);
      return complete(x.value + 10);
    })
    .map(([x]) => {
      effects.set(0, x.value + 12);
      return complete(x.value + 12);
    });

  await delay(1000);

  t.equal(effects.size, 2);
  t.equal(effects.get(1), 30);
  t.equal(effects.get(0), 42);
});

test('succeeding pipe with map will trigger the first', async t => {
  const effects = new Map<number, number>();

  Continuation(complete(5))
    .pipe(([x]) => complete(x.value + 5))
    .pipe(([x]) => complete(x.value + 10))
    .map(([x]) => {
      effects.set(1, x.value + 10);
      return complete(x.value + 10);
    })
    .map(([x]) => {
      effects.set(0, x.value + 12);
      return complete(x.value + 12);
    });

  await delay(1000);

  t.equal(effects.size, 2);
  t.equal(effects.get(1), 30);
  t.equal(effects.get(0), 42);
});
