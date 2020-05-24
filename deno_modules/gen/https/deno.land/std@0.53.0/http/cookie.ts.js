import { assert } from "../testing/asserts.ts";
import { toIMF } from "../datetime/mod.ts";
function toString(cookie) {
    if (!cookie.name) {
        return "";
    }
    const out = [];
    out.push(`${cookie.name}=${cookie.value}`);
    // Fallback for invalid Set-Cookie
    // ref: https://tools.ietf.org/html/draft-ietf-httpbis-cookie-prefixes-00#section-3.1
    if (cookie.name.startsWith("__Secure")) {
        cookie.secure = true;
    }
    if (cookie.name.startsWith("__Host")) {
        cookie.path = "/";
        cookie.secure = true;
        delete cookie.domain;
    }
    if (cookie.secure) {
        out.push("Secure");
    }
    if (cookie.httpOnly) {
        out.push("HttpOnly");
    }
    if (typeof cookie.maxAge === "number" && Number.isInteger(cookie.maxAge)) {
        assert(cookie.maxAge > 0, "Max-Age must be an integer superior to 0");
        out.push(`Max-Age=${cookie.maxAge}`);
    }
    if (cookie.domain) {
        out.push(`Domain=${cookie.domain}`);
    }
    if (cookie.sameSite) {
        out.push(`SameSite=${cookie.sameSite}`);
    }
    if (cookie.path) {
        out.push(`Path=${cookie.path}`);
    }
    if (cookie.expires) {
        const dateString = toIMF(cookie.expires);
        out.push(`Expires=${dateString}`);
    }
    if (cookie.unparsed) {
        out.push(cookie.unparsed.join("; "));
    }
    return out.join("; ");
}
/**
 * Parse the cookies of the Server Request
 * @param req Server Request
 */
export function getCookies(req) {
    const cookie = req.headers.get("Cookie");
    if (cookie != null) {
        const out = {};
        const c = cookie.split(";");
        for (const kv of c) {
            const [cookieKey, ...cookieVal] = kv.split("=");
            assert(cookieKey != null);
            const key = cookieKey.trim();
            out[key] = cookieVal.join("=");
        }
        return out;
    }
    return {};
}
/**
 * Set the cookie header properly in the Response
 * @param res Server Response
 * @param cookie Cookie to set
 * Example:
 *
 *     setCookie(response, { name: 'deno', value: 'runtime',
 *        httpOnly: true, secure: true, maxAge: 2, domain: "deno.land" });
 */
export function setCookie(res, cookie) {
    if (!res.headers) {
        res.headers = new Headers();
    }
    // TODO (zekth) : Add proper parsing of Set-Cookie headers
    // Parsing cookie headers to make consistent set-cookie header
    // ref: https://tools.ietf.org/html/rfc6265#section-4.1.1
    const v = toString(cookie);
    if (v) {
        res.headers.append("Set-Cookie", v);
    }
}
/**
 *  Set the cookie header properly in the Response to delete it
 * @param res Server Response
 * @param name Name of the cookie to Delete
 * Example:
 *
 *     delCookie(res,'foo');
 */
export function delCookie(res, name) {
    setCookie(res, {
        name: name,
        value: "",
        expires: new Date(0),
    });
}
//# sourceMappingURL=file:///C:/Users/kokou/workspace/typescript/deno-clean-architecture/deno_modules/gen/https/deno.land/std@0.53.0/http/cookie.ts.js.map