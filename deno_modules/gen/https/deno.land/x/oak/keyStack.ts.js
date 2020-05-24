// Copyright 2018-2020 the oak authors. All rights reserved. MIT license.
// This was inspired by [keygrip](https://github.com/crypto-utils/keygrip/)
// which allows signing of data (cookies) to prevent tampering, but also allows
// for easy key rotation without needing to resign the data.
import { HmacSha256 } from "./deps.ts";
import { compare } from "./tssCompare.ts";
const replacements = {
    "/": "_",
    "+": "-",
    "=": "",
};
export class KeyStack {
    /** A class which accepts an array of keys that are used to sign and verify
     * data and allows easy key rotation without invalidation of previously signed
     * data.
     *
     * @param keys An array of keys, of which the index 0 will be used to sign
     *             data, but verification can happen against any key.
     */
    constructor(keys) {
        this.#sign = (data, key) => {
            return btoa(String.fromCharCode.apply(undefined, new Uint8Array(new HmacSha256(key).update(data).arrayBuffer())))
                .replace(/\/|\+|=/g, (c) => replacements[c]);
        };
        if (!(0 in keys)) {
            throw new TypeError("keys must contain at least one value");
        }
        this.#keys = keys;
    }
    #keys;
    #sign;
    /** Take `data` and return a SHA256 HMAC digest that uses the current 0 index
     * of the `keys` passed to the constructor.  This digest is in the form of a
     * URL safe base64 encoded string. */
    sign(data) {
        return this.#sign(data, this.#keys[0]);
    }
    /** Given `data` and a `digest`, verify that one of the `keys` provided the
     * constructor was used to generate the `digest`.  Returns `true` if one of
     * the keys was used, otherwise `false`. */
    verify(data, digest) {
        return this.indexOf(data, digest) > -1;
    }
    /** Given `data` and a `digest`, return the current index of the key in the
     * `keys` passed the constructor that was used to generate the digest.  If no
     * key can be found, the method returns `-1`. */
    indexOf(data, digest) {
        for (let i = 0; i < this.#keys.length; i++) {
            if (compare(digest, this.#sign(data, this.#keys[i]))) {
                return i;
            }
        }
        return -1;
    }
}
//# sourceMappingURL=file:///C:/Users/kokou/workspace/typescript/deno-clean-architecture/deno_modules/gen/https/deno.land/x/oak/keyStack.ts.js.map