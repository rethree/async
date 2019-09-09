import { Identity, Lazy } from '../@types';

const isLazy = <a>(x: a | Lazy<a>): x is Lazy<a> => typeof x === 'function';

const identity = <a>(x: a | Lazy<a>): Identity<a> => {
  const id = () => (isLazy(x) ? x() : x);
  id.alg = id;
  id.map = () => identity(x);
  return id;
};

export const Id = identity;
