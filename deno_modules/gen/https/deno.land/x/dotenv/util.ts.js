export function trim(val) {
    return val.trim();
}
export function compact(obj) {
    return Object.keys(obj).reduce((result, key) => {
        if (obj[key]) {
            result[key] = obj[key];
        }
        return result;
    }, {});
}
export function difference(arrA, arrB) {
    return arrA.filter((a) => arrB.indexOf(a) < 0);
}
//# sourceMappingURL=file:///C:/Users/kokou/workspace/typescript/deno-clean-architecture/deno_modules/gen/https/deno.land/x/dotenv/util.ts.js.map