export const B = <a>(...fs: ((x: a) => a)[]) =>
  fs.reduceRight((f0, f1) => x => f1(f0(x)));
