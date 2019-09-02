import { Tr } from '../../constants';
import { Step, Trampolined, Jump, IO } from '../../../@types';

const jump = <a, as extends any[]>(
  f: IO<Step<a, as>>
): Trampolined<IO<Step<a, as>>> => ({
  [Tr]: f
});

const trampolined = <a>(x: a) => typeof x === 'object' && Tr in x;

export const trampoline = <a, as extends any[]>(
  tf: (x: Jump<a, as>) => Step<a, as>
) => (acc: a, ...args: as) => {
  const f = tf(jump);
  let x = f(acc, ...args);

  while (trampolined(x)) {
    x = x[Tr]();
  }

  return x as a;
};
