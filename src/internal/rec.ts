import { Step, Rec, Lift, IO, Lifted } from '../../@types';

const step = <a, bs extends any[]>(
  f: IO<Step<a, bs>>
): Rec<IO<Step<a, bs>>> => ({
  [Lifted]: f
});

const lifted = <a>(x: a) => typeof x === 'object' && Lifted in x;

export const rec = <a, bs extends any[]>(
  it: (x: Lift<a, bs>) => Step<a, bs>
) => (acc: a, ...args: bs) => {
  const f = it(step);

  let pos = f(acc, ...args);
  while (lifted(pos)) {
    pos = pos[Lifted]();
  }

  return pos as a;
};
