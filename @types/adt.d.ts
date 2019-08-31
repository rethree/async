type _ = unknown;

export type Morphism<a, b> = (x: a) => b;

export type EndoMorphism<a> = Morphism<a, a>;

export type EndoFunctor<a, b> = {
  map: <Fa extends EndoFunctor<a, b> & b>(m: EndoMorphism<a>) => Fa;
};

export type FAlgebra<a, b = _> = EndoFunctor<a, b> & b & { alg: () => a };

export type InitialAlgebra<
  a,
  b = _,
  Fa extends FAlgebra<a, b> = FAlgebra<a, b>
> = [(x: a) => Fa, (x: a, fa: Fa) => Fa, () => Fa];
