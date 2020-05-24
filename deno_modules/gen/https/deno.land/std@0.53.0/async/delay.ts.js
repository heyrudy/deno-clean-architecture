// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
/* Resolves after the given number of milliseconds. */
export function delay(ms) {
    return new Promise((res) => setTimeout(() => {
        res();
    }, ms));
}
//# sourceMappingURL=file:///C:/Users/kokou/workspace/typescript/deno-clean-architecture/deno_modules/gen/https/deno.land/std@0.53.0/async/delay.ts.js.map