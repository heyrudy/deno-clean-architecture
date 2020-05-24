// Copyright 2018-2020 the oak authors. All rights reserved. MIT license.
import { Context } from "./context.ts";
import { serve as defaultServe, serveTLS as defaultServeTls, STATUS_TEXT, } from "./deps.ts";
import { KeyStack } from "./keyStack.ts";
import { compose } from "./middleware.ts";
function isOptionsTls(options) {
    return options.secure === true;
}
const ADDR_REGEXP = /^\[?([^\]]*)\]?:([0-9]{1,5})$/;
export class ApplicationErrorEvent extends ErrorEvent {
    constructor(type, eventInitDict) {
        super(type, eventInitDict);
        this.context = eventInitDict.context;
    }
}
/** A class which registers middleware (via `.use()`) and then processes
 * inbound requests against that middleware (via `.listen()`).
 *
 * The `context.state` can be typed via passing a generic argument when
 * constructing an instance of `Application`.
 */
export class Application extends EventTarget {
    constructor(options = {}) {
        super();
        this.#middleware = [];
        /** Deal with uncaught errors in either the middleware or sending the
         * response. */
        this.#handleError = (context, error) => {
            if (!(error instanceof Error)) {
                error = new Error(`non-error thrown: ${JSON.stringify(error)}`);
            }
            const { message } = error;
            this.dispatchEvent(new ApplicationErrorEvent("error", { context, message, error }));
            if (!context.response.writable) {
                return;
            }
            for (const key of context.response.headers.keys()) {
                context.response.headers.delete(key);
            }
            if (error.headers && error.headers instanceof Headers) {
                for (const [key, value] of error.headers) {
                    context.response.headers.set(key, value);
                }
            }
            context.response.type = "text";
            const status = context.response.status =
                error instanceof Deno.errors.NotFound
                    ? 404
                    : error.status && typeof error.status === "number"
                        ? error.status
                        : 500;
            context.response.body = error.expose
                ? error.message
                : STATUS_TEXT.get(status);
        };
        /** Processing registered middleware on each request. */
        this.#handleRequest = async (request, state) => {
            const context = new Context(this, request);
            if (!state.closing && !state.closed) {
                state.handling = true;
                try {
                    await state.middleware(context);
                }
                catch (err) {
                    this.#handleError(context, err);
                }
                finally {
                    state.handling = false;
                }
            }
            try {
                await request.respond(context.response.toServerResponse());
                if (state.closing) {
                    state.server.close();
                    state.closed = true;
                }
            }
            catch (err) {
                this.#handleError(context, err);
            }
        };
        const { state, keys, serve = defaultServe, serveTls = defaultServeTls, } = options;
        this.keys = keys;
        this.state = state ?? {};
        this.#serve = serve;
        this.#serveTls = serveTls;
    }
    #keys;
    #middleware;
    #serve;
    #serveTls;
    /** A set of keys, or an instance of `KeyStack` which will be used to sign
     * cookies read and set by the application to avoid tampering with the
     * cookies. */
    get keys() {
        return this.#keys;
    }
    set keys(keys) {
        if (!keys) {
            this.#keys = undefined;
            return;
        }
        else if (Array.isArray(keys)) {
            this.#keys = new KeyStack(keys);
        }
        else {
            this.#keys = keys;
        }
    }
    /** Deal with uncaught errors in either the middleware or sending the
     * response. */
    #handleError;
    /** Processing registered middleware on each request. */
    #handleRequest;
    addEventListener(type, listener, options) {
        super.addEventListener(type, listener, options);
    }
    async listen(options) {
        if (!this.#middleware.length) {
            return Promise.reject(new TypeError("There is no middleware to process requests."));
        }
        if (typeof options === "string") {
            const match = ADDR_REGEXP.exec(options);
            if (!match) {
                throw TypeError(`Invalid address passed: "${options}"`);
            }
            const [, hostname, portStr] = match;
            options = { hostname, port: parseInt(portStr, 10) };
        }
        const middleware = compose(this.#middleware);
        const server = isOptionsTls(options)
            ? this.#serveTls(options)
            : this.#serve(options);
        const { signal } = options;
        const state = {
            closed: false,
            closing: false,
            handling: false,
            middleware,
            server,
        };
        if (signal) {
            signal.addEventListener("abort", () => {
                if (!state.handling) {
                    server.close();
                    state.closed = true;
                }
                state.closing = true;
            });
        }
        try {
            for await (const request of server) {
                this.#handleRequest(request, state);
            }
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Application Error";
            this.dispatchEvent(new ApplicationErrorEvent("error", { message, error }));
        }
    }
    /** Register middleware to be used with the application. */
    use(...middleware) {
        this.#middleware.push(...middleware);
        return this;
    }
}
//# sourceMappingURL=file:///C:/Users/kokou/workspace/typescript/deno-clean-architecture/deno_modules/gen/https/deno.land/x/oak/application.ts.js.map