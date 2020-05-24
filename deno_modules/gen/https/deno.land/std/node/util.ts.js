export { callbackify } from "./_util/_util_callbackify.ts";
export function isArray(value) {
    return Array.isArray(value);
}
export function isBoolean(value) {
    return typeof value === "boolean" || value instanceof Boolean;
}
export function isNull(value) {
    return value === null;
}
export function isNullOrUndefined(value) {
    return value === null || value === undefined;
}
export function isNumber(value) {
    return typeof value === "number" || value instanceof Number;
}
export function isString(value) {
    return typeof value === "string" || value instanceof String;
}
export function isSymbol(value) {
    return typeof value === "symbol";
}
export function isUndefined(value) {
    return value === undefined;
}
export function isObject(value) {
    return value !== null && typeof value === "object";
}
export function isError(e) {
    return e instanceof Error;
}
export function isFunction(value) {
    return typeof value === "function";
}
export function isRegExp(value) {
    return value instanceof RegExp;
}
export function isPrimitive(value) {
    return (value === null || (typeof value !== "object" && typeof value !== "function"));
}
export function validateIntegerRange(value, name, min = -2147483648, max = 2147483647) {
    // The defaults for min and max correspond to the limits of 32-bit integers.
    if (!Number.isInteger(value)) {
        throw new Error(`${name} must be 'an integer' but was ${value}`);
    }
    if (value < min || value > max) {
        throw new Error(`${name} must be >= ${min} && <= ${max}.  Value was ${value}`);
    }
}
import { _TextDecoder, _TextEncoder } from "./_utils.ts";
export const TextDecoder = _TextDecoder;
export const TextEncoder = _TextEncoder;
//# sourceMappingURL=file:///C:/Users/kokou/workspace/typescript/deno-clean-architecture/deno_modules/gen/https/deno.land/std/node/util.ts.js.map