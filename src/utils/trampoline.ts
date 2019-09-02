import { Step, Trampolined, Jump, IO, Tr } from '../../@types';

const jump = <a, bs extends any[]>(
  f: IO<Step<a, bs>>
): Trampolined<IO<Step<a, bs>>> => ({
  [Tr]: f
});

const trampolined = <a>(x: a) => typeof x === 'object' && Tr in x;

export const trampoline = <a, bs extends any[]>(
  it: (x: Jump<a, bs>) => Step<a, bs>
) => (acc: a, ...args: bs) => {
  const f = it(jump);

  let pos = f(acc, ...args);
  while (trampolined(pos)) {
    pos = pos[Tr]();
  }

  return pos as a;
};
