# @recubed/async

[![Build Status](https://travis-ci.org/rethree/async.svg?branch=master)](https://travis-ci.org/rethree/async)
[![CodeFactor](https://www.codefactor.io/repository/github/rethree/async/badge)](https://www.codefactor.io/repository/github/rethree/async)
[![Coverage Status](https://coveralls.io/repos/github/rethree/async/badge.svg?branch=master)](https://coveralls.io/github/rethree/async?branch=master)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)
[![dependencies
Status](https://david-dm.org/rethree/async/status.svg)](https://david-dm.org/rethree/async)
[![devDependencies Status](https://david-dm.org/rethree/async/dev-status.svg)](https://david-dm.org/rethree/async?type=dev)

Minimal set of **functional async primitives**.

Inspired by algebraic data types, functional programming principles and some other `TypeScript` libraries (e.g. `fp-ts`). Interfaces follow purity, laziness, safety and declarativeness as their main design factors.
Mostly here to support my incoming `Redux` `REST` client but can definitely be used as a stand-alone utility library.

The following set of utilities is being exposed:

##### Options

The very basic types `Task`'s operate on. Represent two of possible task results - completion and failure, forming a tagged union over a `tag` property. Can be created with `Faulted` and `Completed` constructors. Unless manually crafted will always be wrapped in an array to ensure consistent continuation handling.

##### Task

`(Promise | Lazy Promise) a -> Lazy Promise (Completed a | Faulted)`

Task constructor accepts both eager and lazy promises. It will return a `thunk`'ed version of the promise regardless of the input type. Lazy ones will not get started until task function returns.

```typescript
// Creation
const task = Task(Promise.resolve(42));
// or
const task = Task(() => Promise.resolve(42));
// or
const task = complete(42);
// or
const task = complete(Promise.resolve(42));

task().then(console.log);
// [ { tag: 'completed', value: 42, meta: { args: [] } } ]

task().then(console.log);
// [ { tag: 'completed', value: 42, meta: { args: [] } } ]
```

Unlike promises, `Task`'s do not reject. Promise rejections are handled internally and wrapped in `Faulted` option type. This brings some advantages to the table, i.e. purity, branching reduction and unhandled rejections problem trivialisation.

```typescript
const task = Task(() => Promise.reject(42));
task().then(console.log);
// [ { tag: 'faulted', fault: 42, meta: { args: [] } } ]
```

Lazy tasks may optionally accept parameters. They will be returned within the result object, under `meta.args`. This may turn out useful in distributed context where promises are passed around and it is not immediately obvious what the failure reason was for the consuming code. Think of complex effectful procedures, i.e. `Redux-Saga` fetching `REST` resources.

```typescript
const task = Task(
  url => fetch(url).then(resp => resp.json()),
  'https://non.existent'
);
task().then(([fault]) => console.log(fault.meta.args));
// [ 'https://non.existent' ]
```

Additionally, `Task` module exposes a set of helper functions to simplify common, well - tasks.

```typescript
// Create a task of 'faulted' type
const task = fail(42);
task().then(console.log);
// [ { tag: 'faulted', fault: 42, meta: { args: [] } } ]

// Create a task from a 'completed' option
const task = from(Completed(42));
task().then(console.log);
// [ { tag: 'completed', value: 42, meta: {} } ]

// Create a task from a 'faulted' option
const task = from(Faulted(42));
task().then(console.log);
// [ { tag: 'completed', fault: 42, meta: {} } ]
```

##### Parallel

The 'Parallel' module is a functional wrapper over native `Promise.all` api, _ceteris paribus_. Design approach is similar to that of `Task`, except for that it only accepts lazy promises as input functions. `TypeScript` signature further restricts it to operate on `Option`-returning promises and it is advised to only use built-in `Task` constructors for the input functions. No guarantees in regards to control flow (read - rejections) are given otherwise. This will be simplified once `Promise.allSettled` lands in official runtimes.

```typescript
const all = Parallel(complete(42), fail(9001));
all().then(console.log);
// [ { tag: 'completed', value: 42, meta: { args: [] } },
//   { tag: 'faulted', fault: 9001, meta: { args: [] } } ]
```

##### Continuation

...

#### incoming

- Free Continuation, trampolined;
- Retry;
