# @recubed/tasks

[![Build Status](https://travis-ci.org/tanfonto/recubed-tasks.svg?branch=master)](https://travis-ci.org/tanfonto/recubed-tasks)
[![MIT
license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)
[![CodeFactor](https://www.codefactor.io/repository/github/tanfonto/recubed-tasks/badge)](https://www.codefactor.io/repository/github/tanfonto/recubed-tasks)
[![Coverage Status](https://coveralls.io/repos/github/tanfonto/recubed-tasks/badge.svg?branch=master)](https://coveralls.io/github/tanfonto/recubed-tasks?branch=master)

Curated (aka arbitrary) set of **functional async primitives**, including lightweigt native wrappers (`Task`), alternatives (`Parallel` -> `Promise.allSettled`) and utilities for non-(yet)-existent features (`Sequence`). Mostly there to support my incoming `Redux` REST client but could be of use independently;

Heavily influenced by ideas borrowed from functional languages (i.e. purity, function composition, variants, f-algebras, catamorphisms) and other JavaScript libraries (e.g. `fp-ts`).
