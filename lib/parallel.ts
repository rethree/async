import { TaskDef, _ } from "./types";

export const Parallel = <a>(...tasks: TaskDef<a>[]): TaskDef<_[]> => {};
