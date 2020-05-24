// Copyright 2018-2020 the oak authors. All rights reserved. MIT license.
/** Compose multiple middleware functions into a single middleware function. */
export function compose(middleware) {
    return function composedMiddleware(context, next) {
        let index = -1;
        function dispatch(i) {
            if (i <= index) {
                Promise.reject(new Error("next() called multiple times."));
            }
            index = i;
            let fn = middleware[i];
            if (i === middleware.length) {
                fn = next;
            }
            if (!fn) {
                return Promise.resolve();
            }
            try {
                return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
            }
            catch (err) {
                return Promise.reject(err);
            }
        }
        return dispatch(0);
    };
}
//# sourceMappingURL=file:///C:/Users/kokou/workspace/typescript/deno-clean-architecture/deno_modules/gen/https/deno.land/x/oak/middleware.ts.js.map