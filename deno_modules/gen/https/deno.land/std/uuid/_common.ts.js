// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
export function bytesToUuid(bytes) {
    const bits = [...bytes].map((bit) => {
        const s = bit.toString(16);
        return bit < 0x10 ? "0" + s : s;
    });
    return [
        ...bits.slice(0, 4),
        "-",
        ...bits.slice(4, 6),
        "-",
        ...bits.slice(6, 8),
        "-",
        ...bits.slice(8, 10),
        "-",
        ...bits.slice(10, 16),
    ].join("");
}
export function uuidToBytes(uuid) {
    const bytes = [];
    uuid.replace(/[a-fA-F0-9]{2}/g, (hex) => {
        bytes.push(parseInt(hex, 16));
        return "";
    });
    return bytes;
}
export function stringToBytes(str) {
    str = unescape(encodeURIComponent(str));
    const bytes = new Array(str.length);
    for (let i = 0; i < str.length; i++) {
        bytes[i] = str.charCodeAt(i);
    }
    return bytes;
}
export function createBuffer(content) {
    const arrayBuffer = new ArrayBuffer(content.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < content.length; i++) {
        uint8Array[i] = content[i];
    }
    return arrayBuffer;
}
//# sourceMappingURL=file:///C:/Users/kokou/workspace/typescript/deno-clean-architecture/deno_modules/gen/https/deno.land/std/uuid/_common.ts.js.map