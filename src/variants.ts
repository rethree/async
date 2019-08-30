import { Faulted, Succeeded, StrMap, Variant } from '../@types';

export const Fault = (meta: StrMap) => (error: Error): Faulted => ({
  tag: 'faulted',
  error,
  meta
});

export const Success = (meta: StrMap) => <a>(value: a): Succeeded<a> => ({
  tag: 'succeeded',
  value,
  meta
});

export const isFaulted = <a>(x: Variant<a>): x is Faulted =>
  x.tag === 'faulted';
