import { test } from 'tap';
import { apply, complete, fail, Parallel, Continuation, Task } from '../src';

test('map is eager', async t => {
  const effects: number[] = [];

  Continuation(complete(10))
    .map(_ => {
      effects.push(0);
      return complete('a');
    })
    .map(_ => {
      effects.push(1);
      return fail(12);
    })
    .map(_ => {
      t.same([0, 1], effects);
      return complete(9001);
    });
});

test('map carries failures', async t => {
  const piped = await Continuation(complete(10))
    .map(_ => fail(12))
    .map(_ => complete(9001))();

  t.equal(piped.length, 1);
  t.equal(piped[0]['fault'], 12);
});

test('extend carries failures', async t => {
  const piped = await Continuation(complete(10))
    .extend(wa => wa().then(fail(12)))
    .extend(wb => wb().then(complete(9001)))();

  t.equal(piped.length, 1);
  t.equal(piped[0]['fault'], 12);
});

test('pipe carries failures', async t => {
  const piped = await Continuation(complete(10))
    .pipe(_ => fail(12))
    .pipe(_ => complete(9001))();

  t.equal(piped.length, 1);
  t.equal(piped[0]['fault'], 12);
});

test('map carries completions', async t => {
  const piped = await Continuation(complete(10))
    .map(_ => complete(12))
    .map(_ => complete(9001))();

  t.equal(piped.length, 1);
  t.equal(piped[0]['value'], 9001);
});

test('extend carries completions', async t => {
  const piped = await Continuation(complete(10))
    .extend(wa => wa().then(complete(12)))
    .extend(wb => wb().then(complete(9001)))();

  t.equal(piped.length, 1);
  t.equal(piped[0]['value'], 9001);
});

test('pipe carries completions', async t => {
  const piped = await Continuation(complete(10))
    .pipe(_ => complete(12))
    .pipe(_ => complete(9001))();

  t.equal(piped.length, 1);
  t.equal(piped[0]['value'], 9001);
});

test('map carries parallel tasks', async t => {
  const piped = await Continuation(complete(10)).map(_ =>
    Parallel(complete(12), fail(10))
  )();

  t.equal(piped.length, 2);
  t.equal(piped[0]['value'], 12);
  t.equal(piped[1]['fault'], 10);
});

test('extend carries parallel tasks', async t => {
  const piped = await Continuation(complete(10)).extend(wa =>
    wa().then(Parallel(complete(12), fail(10)))
  )();

  t.equal(piped.length, 2);
  t.equal(piped[0]['value'], 12);
  t.equal(piped[1]['fault'], 10);
});

test('pipe carries parallel tasks', async t => {
  const piped = await Continuation(complete(10)).pipe(_ =>
    Parallel(complete(12), fail(10))
  )();

  t.equal(piped.length, 2);
  t.equal(piped[0]['value'], 12);
  t.equal(piped[1]['fault'], 10);
});

test('mapped results are transformed according to morphism provided', async t => {
  const piped = await Continuation(complete(10))
    .map(([x]) => complete(x.value + 6))
    .map(([x]) => Task(Promise.resolve(x.value + 5)))
    .map(([x]) => complete(x.value * 2))();

  t.equal(piped.length, 1);
  t.equal(piped[0]['value'], 42);
});

test('extended results are transformed according to morphism provided', async t => {
  const piped = await Continuation(complete(10))
    .extend(wa => wa().then(apply(([x]) => Task(Promise.resolve(x.value + 5)))))
    .extend(wa => wa().then(apply(([x]) => Task(Promise.resolve(x.value + 6)))))
    .extend(wa => wa().then(apply(([x]) => complete(x.value * 2))))();

  t.equal(piped.length, 1);
  t.equal(piped[0]['value'], 42);
});

test('results extended by pipe are transformed according to morphism provided', async t => {
  const piped = await Continuation(complete(10))
    .pipe(([x]) => complete(x.value + 6))
    .pipe(([x]) => Task(Promise.resolve(x.value + 5)))
    .pipe(([x]) => complete(x.value * 2))();

  t.equal(piped.length, 1);
  t.equal(piped[0]['value'], 42);
});
