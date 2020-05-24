export function notImplemented(msg) {
    const message = msg ? `Not implemented: ${msg}` : "Not implemented";
    throw new Error(message);
}
export const _TextDecoder = TextDecoder;
export const _TextEncoder = TextEncoder;
export function intoCallbackAPI(
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
func, cb, 
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
...args) {
    func(...args)
        .then((value) => cb && cb(null, value))
        .catch((err) => cb && cb(err, null));
}
export function intoCallbackAPIWithIntercept(
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
func, interceptor, cb, 
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
...args) {
    func(...args)
        .then((value) => cb && cb(null, interceptor(value)))
        .catch((err) => cb && cb(err, null));
}
export function spliceOne(list, index) {
    for (; index + 1 < list.length; index++)
        list[index] = list[index + 1];
    list.pop();
}
//# sourceMappingURL=file:///C:/Users/kokou/workspace/typescript/deno-clean-architecture/deno_modules/gen/https/deno.land/std/node/_utils.ts.js.map