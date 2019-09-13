# @recubed/async

[![Build Status](https://travis-ci.org/rethree/async.svg?branch=master)](https://travis-ci.org/rethree/async)
[![CodeFactor](https://www.codefactor.io/repository/github/rethree/async/badge)](https://www.codefactor.io/repository/github/rethree/async)
[![Coverage Status](https://coveralls.io/repos/github/rethree/async/badge.svg?branch=master)](https://coveralls.io/github/rethree/async?branch=master)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)
[![dependencies
Status](https://david-dm.org/rethree/async/status.svg)](https://david-dm.org/rethree/async) 
[![devDependencies Status](https://david-dm.org/rethree/async/dev-status.svg)](https://david-dm.org/rethree/async?type=dev)


Curated (aka arbitrary) set of **functional async primitives**, including lightweigt native wrappers (`Task`), alternatives (`Parallel` -> `Promise.allSettled`) and utilities for non-(yet)-existent features (`Sequence`). Mostly there to support my incoming `Redux` REST client but could be of use independently;

Heavily influenced by ideas borrowed from functional languages (i.e. purity, function composition, variants, comonads, f-algebras, catamorphisms) and other JavaScript libraries (e.g. `fp-ts`).
