/*!
 * Adapted from koa-send at https://github.com/koajs/send and which is licensed
 * with the MIT license.
 */
import { createHttpError } from "./httpError.ts";
import { basename, extname, parse, sep } from "./deps.ts";
import { decodeComponent, resolvePath } from "./util.ts";
function isHidden(root, path) {
    const pathArr = path.substr(root.length).split(sep);
    for (const segment of pathArr) {
        if (segment[0] === ".") {
            return true;
        }
        return false;
    }
}
async function exists(path) {
    try {
        return (await Deno.stat(path)).isFile;
    }
    catch {
        return false;
    }
}
/** Asynchronously fulfill a response with a file from the local file
 * system.
 *
 * Requires Deno read permission. */
export async function send({ request, response }, path, options = { root: "" }) {
    const { brotli = true, extensions, format = true, gzip = true, index, hidden = false, immutable = false, maxage = 0, root, } = options;
    const trailingSlash = path[path.length - 1] === "/";
    path = decodeComponent(path.substr(parse(path).root.length));
    if (index && trailingSlash) {
        path += index;
    }
    path = resolvePath(root, path);
    if (!hidden && isHidden(root, path)) {
        return;
    }
    let encodingExt = "";
    if (brotli &&
        request.acceptsEncodings("br", "identity") === "br" &&
        (await exists(`${path}.br`))) {
        path = `${path}.br`;
        response.headers.set("Content-Encoding", "br");
        response.headers.delete("Content-Length");
        encodingExt = ".br";
    }
    else if (gzip &&
        request.acceptsEncodings("gzip", "identity") === "gzip" &&
        (await exists(`${path}.gz`))) {
        path = `${path}.gz`;
        response.headers.set("Content-Encoding", "gzip");
        response.headers.delete("Content-Length");
        encodingExt = ".gz";
    }
    if (extensions && !/\.[^/]*$/.exec(path)) {
        for (let ext of extensions) {
            if (!/^\./.exec(ext)) {
                ext = `.${ext}`;
            }
            if (await exists(`${path}${ext}`)) {
                path += ext;
                break;
            }
        }
    }
    let stats;
    try {
        stats = await Deno.stat(path);
        if (stats.isDirectory) {
            if (format && index) {
                path += `/${index}`;
                stats = await Deno.stat(path);
            }
            else {
                return;
            }
        }
    }
    catch (err) {
        if (err instanceof Deno.errors.NotFound) {
            throw createHttpError(404, err.message);
        }
        throw createHttpError(500, err.message);
    }
    response.headers.set("Content-Length", String(stats.size));
    if (!response.headers.has("Last-Modified") && stats.mtime) {
        response.headers.set("Last-Modified", stats.mtime.toUTCString());
    }
    if (!response.headers.has("Cache-Control")) {
        const directives = [`max-age=${(maxage / 1000) | 0}`];
        if (immutable) {
            directives.push("immutable");
        }
        response.headers.set("Cache-Control", directives.join(","));
    }
    if (!response.type) {
        response.type = encodingExt !== ""
            ? extname(basename(path, encodingExt))
            : extname(path);
    }
    response.body = await Deno.readFile(path);
    return path;
}
//# sourceMappingURL=file:///C:/Users/kokou/workspace/typescript/deno-clean-architecture/deno_modules/gen/https/deno.land/x/oak/send.ts.js.map