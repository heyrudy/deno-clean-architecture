/**
 * Adapted directly from koa-router at
 * https://github.com/koajs/router/ which is licensed as:
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Alexander C. Mingoia
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
import { pathToRegexp, Status } from "./deps.ts";
import { httpErrors } from "./httpError.ts";
import { compose } from "./middleware.ts";
import { decodeComponent } from "./util.ts";
const { MethodNotAllowed, NotImplemented } = httpErrors;
class Layer {
    constructor(path, methods, middleware, options = {}) {
        this.path = path;
        this.methods = methods;
        this.options = options;
        this.paramNames = [];
        this.name = options.name ?? null;
        this.stack = Array.isArray(middleware) ? middleware : [middleware];
        if (this.methods.includes("GET")) {
            this.methods.unshift("HEAD");
        }
        this.regexp = pathToRegexp(path, this.paramNames, options);
    }
    matches(path) {
        return this.regexp.test(path);
    }
    params(captures, existingParams = {}) {
        const params = existingParams;
        for (let i = 0; i < captures.length; i++) {
            if (this.paramNames[i]) {
                const capture = captures[i];
                params[this.paramNames[i].name] = capture
                    ? decodeComponent(capture)
                    : capture;
            }
        }
        return params;
    }
    captures(path) {
        if (this.options.ignoreCaptures) {
            return [];
        }
        const [, ...captures] = path.match(this.regexp);
        return captures;
    }
    setPrefix(prefix) {
        if (this.path) {
            this.path = `${prefix}${this.path}`;
            this.paramNames = [];
            this.regexp = pathToRegexp(this.path, this.paramNames, this.options);
        }
        return this;
    }
}
function inspectLayer(layer) {
    const { path, methods, stack, options, regexp } = layer;
    return {
        path,
        methods: [...methods],
        middleware: [...stack],
        options: options ? { ...options } : undefined,
        regexp,
    };
}
const contextRouteMatches = new WeakMap();
/** A class that routes requests to middleware based on the method and the
 * path name of the request.
 */
export class Router {
    constructor({ methods, prefix, strict } = {}) {
        this.#prefix = "";
        this.#stack = [];
        this.#strict = false;
        this.#addRoute = (path, middleware, 
        // deno-fmt-ignore
        ...methods) => {
            if (Array.isArray(path)) {
                for (const r of path) {
                    this.#addRoute(r, middleware, ...methods);
                }
                return this;
            }
            const layer = new Layer(path, methods, middleware, { strict: this.#strict });
            layer.setPrefix(this.#prefix);
            this.#stack.push(layer);
            return this;
        };
        this.#match = (path, method) => {
            const routesMatched = [];
            const matches = [];
            for (const layer of this.#stack) {
                if (layer.matches(path)) {
                    routesMatched.push(layer);
                    if (layer.methods.includes(method)) {
                        matches.push(layer);
                    }
                }
            }
            return { routesMatched, matches };
        };
        this.#methods = methods ?? [
            "DELETE",
            "GET",
            "HEAD",
            "OPTIONS",
            "PATCH",
            "POST",
            "PUT",
        ];
        if (prefix) {
            this.#prefix = prefix;
        }
        if (strict) {
            this.#strict = strict;
        }
    }
    #methods;
    #prefix;
    #stack;
    #strict;
    #addRoute;
    #match;
    /** Register middleware for the specified routes and the `DELETE`, `GET`,
     * `POST`, or `PUT` method is requested
     */
    all(route, ...middleware) {
        return this.#addRoute(route, middleware, "DELETE", "GET", "POST", "PUT");
    }
    /** Middleware that automatically handles dealing with responding with
     * allowed methods for the defined routes.
     */
    allowedMethods(options = {}) {
        const implemented = this.#methods;
        return async function allowedMethods(context, next) {
            await next();
            const allowed = new Set();
            if (!context.response.status ||
                context.response.status === Status.NotFound) {
                const contextRoutesMatched = contextRouteMatches.get(context);
                if (contextRoutesMatched) {
                    for (const layer of contextRoutesMatched) {
                        for (const method of layer.methods) {
                            allowed.add(method);
                        }
                    }
                }
                const allowedValue = Array.from(allowed).join(", ");
                if (!implemented.includes(context.request.method)) {
                    if (options.throw) {
                        let notImplementedThrowable;
                        if (typeof options.notImplemented === "function") {
                            notImplementedThrowable = options.notImplemented();
                        }
                        else {
                            notImplementedThrowable = new NotImplemented();
                        }
                        throw notImplementedThrowable;
                    }
                    else {
                        context.response.status = Status.NotImplemented;
                        context.response.headers.set("Allow", allowedValue);
                    }
                }
                else if (allowed.size) {
                    if (context.request.method === "OPTIONS") {
                        context.response.status = Status.OK;
                        context.response.body = "";
                        context.response.headers.set("Allow", allowedValue);
                    }
                    else if (!allowed.has(context.request.method)) {
                        if (options.throw) {
                            let notAllowedThrowable;
                            if (typeof options.methodNotAllowed === "function") {
                                notAllowedThrowable = options.methodNotAllowed();
                            }
                            else {
                                notAllowedThrowable = new MethodNotAllowed();
                            }
                            throw notAllowedThrowable;
                        }
                        else {
                            context.response.status = Status.MethodNotAllowed;
                            context.response.headers.set("Allow", allowedValue);
                        }
                    }
                }
            }
        };
    }
    /** Register middleware for the specified routes when the `DELETE` method is
     * requested.
     */
    delete(route, ...middleware) {
        return this.#addRoute(route, middleware, "DELETE");
    }
    /** Register middleware for the specified routes when the `GET` method is
     * requested.
     */
    get(route, ...middleware) {
        return this.#addRoute(route, middleware, "GET");
    }
    /** Register middleware for the specified routes when the `HEAD` method is
     * requested.
     */
    head(route, ...middleware) {
        return this.#addRoute(route, middleware, "HEAD");
    }
    /** Register middleware for the specified routes when the `OPTIONS` method is
     * requested.
     */
    options(route, ...middleware) {
        return this.#addRoute(route, middleware, "OPTIONS");
    }
    /** Register middleware for the specified routes when the `PATCH` method is
     * requested.
     */
    patch(route, ...middleware) {
        return this.#addRoute(route, middleware, "PATCH");
    }
    /** Register middleware for the specified routes when the `POST` method is
     * requested.
     */
    post(route, ...middleware) {
        return this.#addRoute(route, middleware, "POST");
    }
    /** Register middleware for the specified routes when the `PUT` method is
     * requested.
     */
    put(route, ...middleware) {
        return this.#addRoute(route, middleware, "PUT");
    }
    /** Return middleware that represents all the currently registered routes. */
    routes() {
        const dispatch = async (context, next) => {
            const { url: { pathname }, method } = context.request;
            const { routesMatched, matches } = this.#match(pathname, method);
            const contextRoutesMatched = contextRouteMatches.get(context);
            contextRouteMatches.set(context, contextRoutesMatched
                ? [...contextRoutesMatched, ...routesMatched]
                : routesMatched);
            context.router = this;
            if (!matches.length) {
                return next();
            }
            const chain = matches.reduce((prev, layer) => {
                prev.push((context, next) => {
                    const captures = layer.captures(pathname);
                    context.params = layer.params(captures, context.params);
                    return next();
                });
                return [...prev, ...layer.stack];
            }, []);
            return compose(chain)(context);
        };
        return dispatch;
    }
    // Iterator interfaces
    *entries() {
        for (const layer of this.#stack) {
            const value = inspectLayer(layer);
            yield [value, value];
        }
    }
    forEach(callback, thisArg = null) {
        for (const layer of this.#stack) {
            const value = inspectLayer(layer);
            callback.call(thisArg, value, value, this);
        }
    }
    *keys() {
        for (const layer of this.#stack) {
            yield inspectLayer(layer);
        }
    }
    *values() {
        for (const layer of this.#stack) {
            yield inspectLayer(layer);
        }
    }
    *[Symbol.iterator]() {
        for (const layer of this.#stack) {
            yield inspectLayer(layer);
        }
    }
}
//# sourceMappingURL=file:///C:/Users/kokou/workspace/typescript/deno-clean-architecture/deno_modules/gen/https/deno.land/x/oak/router.ts.js.map