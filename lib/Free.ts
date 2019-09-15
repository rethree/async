import { AsyncTask } from "./types";

// export const List = <a>(x?: a, fa: ListSpec<a> = nil()) => {
//   if (x === undefined) return nil();
//   const len = fa.len() + 1;
//   return {
//     len: () => len,
//     alg: () => x,
//     succ: () => fa,
//     map: <b>(xf: (x: a) => b) => map(List(x, fa), xf)
//   };
// };

// const nil = <a>(): ListSpec<a> => ({
//   len: () => 0,
//   alg: () => null as any,
//   succ: nil,
//   map: nil
// });

type FreeMonad<a> = {
  succ: <b>(): FreeMonad<b>
}

const Pure = <a>(ta: AsyncTask<a>) => ({
  succ: () => null,
});

const Free = <a, b>() => {
  
}
