type _ = unknown;

export type Morphism<a, b> = (x: a) => b;

export type EndoMorphism<a> = Morphism<a, a>;

export type EndoFunctor<a, w> = {
  map: <Fa extends EndoFunctor<a, w> & w>(m: EndoMorphism<a>) => Fa;
};

export type FAlgebra<a, w = _> = EndoFunctor<a, w> & w & { alg: () => a };

export type InitialAlgebra<
  a,
  w = _,
  Fa extends FAlgebra<a, w> = FAlgebra<a, w>
> = [(x: a, fa?: Fa) => Fa, () => Fa];
