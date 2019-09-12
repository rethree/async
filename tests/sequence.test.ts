import { Seq } from '../src/sequence';
import { complete, pipe } from '../src/task';

const s = Seq(complete(10))
  .extend(w =>
    pipe(
      w(),
      ([{ value }]) => value + 10
    )
  )
  .extend(w =>
    pipe(
      w(),
      ([{ value }]) => value + 10
    )
  );

s().then(x => console.log(x));
