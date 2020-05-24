// Copyright 2018-2020 the oak authors. All rights reserved. MIT license.
import { contentType, Status } from "./deps.ts";
import { isHtml, isRedirectStatus } from "./util.ts";
export const REDIRECT_BACK = Symbol("redirect backwards");
const BODY_TYPES = ["string", "number", "bigint", "boolean", "symbol"];
const encoder = new TextEncoder();
/** Guard for `Deno.Reader`. */
function isReader(value) {
    return typeof value === "object" && "read" in value &&
        typeof value.read === "function";
}
export class Response {
    constructor(request) {
        this.#writable = true;
        this.#getBody = () => {
            const typeofBody = typeof this.body;
            let result;
            this.#writable = false;
            if (BODY_TYPES.includes(typeofBody)) {
                const bodyText = String(this.body);
                result = encoder.encode(bodyText);
                this.type = this.type || (isHtml(bodyText) ? "html" : "text/plain");
            }
            else if (this.body instanceof Uint8Array || isReader(this.body)) {
                result = this.body;
            }
            else if (typeofBody === "object" && this.body !== null) {
                result = encoder.encode(JSON.stringify(this.body));
                this.type = this.type || "json";
            }
            return result;
        };
        this.#setContentType = () => {
            if (this.type) {
                const contentTypeString = contentType(this.type);
                if (contentTypeString && !this.headers.has("Content-Type")) {
                    this.headers.append("Content-Type", contentTypeString);
                }
            }
        };
        /** Headers that will be returned in the response */
        this.headers = new Headers();
        this.#request = request;
    }
    #request;
    #writable;
    #getBody;
    #setContentType;
    get writable() {
        return this.#writable;
    }
    redirect(url, alt = "/") {
        if (url === REDIRECT_BACK) {
            url = this.#request.headers.get("Referrer") ?? String(alt);
        }
        else if (typeof url === "object") {
            url = String(url);
        }
        this.headers.set("Location", encodeURI(url));
        if (!this.status || !isRedirectStatus(this.status)) {
            this.status = Status.Found;
        }
        if (this.#request.accepts("html")) {
            url = encodeURI(url);
            this.type = "text/html; charset=utf-8";
            this.body = `Redirecting to <a href="${url}">${url}</a>.`;
            return;
        }
        this.type = "text/plain; charset=utf-8";
        this.body = `Redirecting to ${url}.`;
    }
    /** Take this response and convert it to the response used by the Deno net
     * server. */
    toServerResponse() {
        // Process the body
        const body = this.#getBody();
        // If there is a response type, set the content type header
        this.#setContentType();
        const { headers, status } = this;
        // If there is no body and no content type and no set length, then set the
        // content length to 0
        if (!(body ||
            headers.has("Content-Type") ||
            headers.has("Content-Length"))) {
            headers.append("Content-Length", "0");
        }
        return {
            status: status ?? (body ? Status.OK : Status.NotFound),
            body,
            headers,
        };
    }
}
//# sourceMappingURL=file:///C:/Users/kokou/workspace/typescript/deno-clean-architecture/deno_modules/gen/https/deno.land/x/oak/response.ts.js.map