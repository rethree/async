import { Option } from "./options";

export const tryCatch = <a, b>(f: (x: a) => b) => (x: a) => {
  const option = Option<b>();
  try {
    return option.Completed({ value: f(x) });
  } catch (err) {
    return option.Faulted({ fault: err });
  }
};
