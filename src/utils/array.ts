export const lift = <a>(xs: a) => (Array.isArray(xs) ? xs : [xs]) as a & any[];
