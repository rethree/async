import { Comonad, Lazy } from '../@types';

export const Seq = <a>(x: Lazy<a>): Comonad<a> => {
  const me = Object.assign(() => x(), {
    alg: () => x(),
    map: f => Seq(() => f(x)),
    extend: f => Seq(() => f(me)),
    duplicate: () => Seq(() => x)
  });

  return me;
};
