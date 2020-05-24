// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { bytesToUuid, createBuffer, stringToBytes, uuidToBytes, } from "./_common.ts";
import { Sha1 } from "../hash/sha1.ts";
import { isString } from "../node/util.ts";
import { assert } from "../testing/asserts.ts";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function validate(id) {
    return UUID_RE.test(id);
}
export function generate(options, buf, offset) {
    const i = (buf && offset) || 0;
    let { value, namespace } = options;
    if (isString(value))
        value = stringToBytes(value);
    if (isString(namespace))
        namespace = uuidToBytes(namespace);
    assert(namespace.length === 16, "namespace must be uuid string or an Array of 16 byte values");
    const content = namespace.concat(value);
    const bytes = new Sha1().update(createBuffer(content)).digest();
    bytes[6] = (bytes[6] & 0x0f) | 0x50;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    if (buf) {
        for (let idx = 0; idx < 16; ++idx) {
            buf[i + idx] = bytes[idx];
        }
    }
    return buf || bytesToUuid(bytes);
}
//# sourceMappingURL=file:///C:/Users/kokou/workspace/typescript/deno-clean-architecture/deno_modules/gen/https/deno.land/std/uuid/v5.ts.js.map