import { AsyncTask, Completion, ContinuationComonad, Failure, Option } from './types';
export declare const apply: <a, b>(f: (x: Completion<a>[]) => AsyncTask<b>) => (results: Option<a>[]) => Failure[] | Completion<b>[];
export declare const pipe: <a, b>(f: (wa: Completion<a>[]) => AsyncTask<b>) => (wa: ContinuationComonad<a>) => AsyncTask<b>;
export declare const Continuation: <a>(x: AsyncTask<a>) => ContinuationComonad<a>;
