import { Option } from "./options";
import { Options } from "./types";

export const tryCatch = <as extends any[], b>(f: (...xs: as) => b) => (
  ...xs: as
): Options<b> => {
  const Opt = Option<b>();
  try {
    return Opt.Completed({ value: f(...xs) });
  } catch (err) {
    return Opt.Faulted({
      fault: {
        error: err,
        args: xs
      }
    });
  }
};
