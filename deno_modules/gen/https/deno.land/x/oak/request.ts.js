// Copyright 2018-2020 the oak authors. All rights reserved. MIT license.
import { httpErrors } from "./httpError.ts";
import { isMediaType } from "./isMediaType.ts";
import { preferredCharsets } from "./negotiation/charset.ts";
import { preferredEncodings } from "./negotiation/encoding.ts";
import { preferredLanguages } from "./negotiation/language.ts";
import { preferredMediaTypes } from "./negotiation/mediaType.ts";
const decoder = new TextDecoder();
const defaultBodyContentTypes = {
    json: ["json", "application/*+json", "application/csp-report"],
    form: ["urlencoded"],
    text: ["text"],
};
export class Request {
    constructor(serverRequest) {
        this.#serverRequest = serverRequest;
    }
    #body;
    #rawBodyPromise;
    #serverRequest;
    #url;
    /** Is `true` if the request has a body, otherwise `false`. */
    get hasBody() {
        return (this.headers.get("transfer-encoding") !== null ||
            !!parseInt(this.headers.get("content-length") ?? ""));
    }
    /** The `Headers` supplied in the request. */
    get headers() {
        return this.#serverRequest.headers;
    }
    /** The HTTP Method used by the request. */
    get method() {
        return this.#serverRequest.method;
    }
    /** Shortcut to `request.url.protocol === "https"`. */
    get secure() {
        return this.url.protocol === "https:";
    }
    /** Returns the _original_ Deno server request. */
    get serverRequest() {
        return this.#serverRequest;
    }
    /** A parsed URL for the request which complies with the browser standards. */
    get url() {
        if (!this.#url) {
            const serverRequest = this.#serverRequest;
            const proto = serverRequest.proto.split("/")[0].toLowerCase();
            this.#url = new URL(`${proto}://${serverRequest.headers.get("host")}${serverRequest.url}`);
        }
        return this.#url;
    }
    accepts(...types) {
        const acceptValue = this.#serverRequest.headers.get("Accept");
        if (!acceptValue) {
            return;
        }
        if (types.length) {
            return preferredMediaTypes(acceptValue, types)[0];
        }
        return preferredMediaTypes(acceptValue);
    }
    acceptsCharsets(...charsets) {
        const acceptCharsetValue = this.#serverRequest.headers.get("Accept-Charset");
        if (!acceptCharsetValue) {
            return;
        }
        if (charsets.length) {
            return preferredCharsets(acceptCharsetValue, charsets)[0];
        }
        return preferredCharsets(acceptCharsetValue);
    }
    acceptsEncodings(...encodings) {
        const acceptEncodingValue = this.#serverRequest.headers.get("Accept-Encoding");
        if (!acceptEncodingValue) {
            return;
        }
        if (encodings.length) {
            return preferredEncodings(acceptEncodingValue, encodings)[0];
        }
        return preferredEncodings(acceptEncodingValue);
    }
    acceptsLanguages(...langs) {
        const acceptLanguageValue = this.#serverRequest.headers.get("Accept-Language");
        if (!acceptLanguageValue) {
            return;
        }
        if (langs.length) {
            return preferredLanguages(acceptLanguageValue, langs)[0];
        }
        return preferredLanguages(acceptLanguageValue);
    }
    async body({ asReader, contentTypes = {} } = {}) {
        if (this.#body) {
            if (asReader && this.#body.type !== "reader") {
                return Promise.reject(new TypeError(`Body already consumed as type: "${this.#body.type}".`));
            }
            else if (this.#body.type === "reader") {
                return Promise.reject(new TypeError(`Body already consumed as type: "reader".`));
            }
            return this.#body;
        }
        const encoding = this.headers.get("content-encoding") || "identity";
        if (encoding !== "identity") {
            throw new httpErrors.UnsupportedMediaType(`Unsupported content-encoding: ${encoding}`);
        }
        if (!this.hasBody) {
            return (this.#body = { type: "undefined", value: undefined });
        }
        const contentType = this.headers.get("content-type");
        if (contentType) {
            if (asReader) {
                return (this.#body = {
                    type: "reader",
                    value: this.#serverRequest.body,
                });
            }
            const rawBody = await (this.#rawBodyPromise ??
                (this.#rawBodyPromise = Deno.readAll(this.#serverRequest.body)));
            const value = decoder.decode(rawBody);
            const contentTypesRaw = contentTypes.raw;
            const contentTypesJson = [
                ...defaultBodyContentTypes.json,
                ...(contentTypes.json ?? []),
            ];
            const contentTypesForm = [
                ...defaultBodyContentTypes.form,
                ...(contentTypes.form ?? []),
            ];
            const contentTypesText = [
                ...defaultBodyContentTypes.text,
                ...(contentTypes.text ?? []),
            ];
            if (contentTypesRaw && isMediaType(contentType, contentTypesRaw)) {
                return (this.#body = { type: "raw", value: rawBody });
            }
            else if (isMediaType(contentType, contentTypesJson)) {
                return (this.#body = { type: "json", value: JSON.parse(value) });
            }
            else if (isMediaType(contentType, contentTypesForm)) {
                return (this.#body = {
                    type: "form",
                    value: new URLSearchParams(value.replace(/\+/g, " ")),
                });
            }
            else if (isMediaType(contentType, contentTypesText)) {
                return (this.#body = { type: "text", value });
            }
            else {
                return (this.#body = { type: "raw", value: rawBody });
            }
        }
        throw new httpErrors.UnsupportedMediaType(contentType
            ? `Unsupported content-type: ${contentType}`
            : "Missing content-type");
    }
}
//# sourceMappingURL=file:///C:/Users/kokou/workspace/typescript/deno-clean-architecture/deno_modules/gen/https/deno.land/x/oak/request.ts.js.map