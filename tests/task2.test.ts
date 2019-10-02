import { Task } from "../lib/task2";

const x = new Task<number>(complete => {
  setTimeout(() => complete(42), 100);
})
  .then(x => x + 42)
  .then(y => y.toString());

test(() => {});
