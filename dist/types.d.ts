export declare const TypeRep: unique symbol;
export declare type _ = unknown;
export declare type StrMap<a = any> = {
    readonly [key: string]: a;
};
export declare type Lazy<a> = () => a;
export declare type Meta = {
    readonly meta: StrMap;
};
export declare type Failure = Meta & {
    readonly tag: 'faulted';
    readonly fault: any;
};
export declare type Completion<a> = Meta & {
    readonly tag: 'completed';
    readonly value: a;
};
export declare type Option<a> = Failure | Completion<a>;
export declare type Thenable<a> = Lazy<PromiseLike<Option<a>[]>>;
export declare type AsyncTask<a> = Thenable<a> & {
    [TypeRep]: any;
};
export declare type Functor<a> = {
    readonly map: <b>(f: (x: a) => b) => Functor<b>;
};
export declare type ContinuationComonad<a> = {
    readonly map: <b>(f: (ca: Completion<a>[]) => AsyncTask<b>) => ContinuationComonad<a | b>;
    readonly pipe: <b>(f: (ca: Completion<a>[]) => AsyncTask<b>) => ContinuationComonad<a | b>;
    readonly extend: <b>(f: (wa: ContinuationComonad<a>) => AsyncTask<b>) => ContinuationComonad<b>;
} & Functor<a> & AsyncTask<a>;
