import { Option } from "./options";

export const tryCatch = <as extends any[], b>(f: (...xs: as) => b) => (
  ...xs: as
) => {
  const option = Option<b>();
  try {
    return option.Completed({ value: f(...xs) });
  } catch (err) {
    return option.Faulted({
      fault: {
        error: err,
        args: xs
      }
    });
  }
};
