// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { encode } from "../encoding/utf8.ts";
import { BufReader, BufWriter } from "../io/bufio.ts";
import { assert } from "../testing/asserts.ts";
import { deferred, MuxAsyncIterator } from "../async/mod.ts";
import { bodyReader, chunkedBodyReader, emptyReader, writeResponse, readRequest, } from "./_io.ts";
const { listen, listenTls } = Deno;
export class ServerRequest {
    constructor() {
        this.done = deferred();
        this._contentLength = undefined;
        this._body = null;
        this.finalized = false;
    }
    /**
     * Value of Content-Length header.
     * If null, then content length is invalid or not given (e.g. chunked encoding).
     */
    get contentLength() {
        // undefined means not cached.
        // null means invalid or not provided.
        if (this._contentLength === undefined) {
            const cl = this.headers.get("content-length");
            if (cl) {
                this._contentLength = parseInt(cl);
                // Convert NaN to null (as NaN harder to test)
                if (Number.isNaN(this._contentLength)) {
                    this._contentLength = null;
                }
            }
            else {
                this._contentLength = null;
            }
        }
        return this._contentLength;
    }
    /**
     * Body of the request.
     *
     *     const buf = new Uint8Array(req.contentLength);
     *     let bufSlice = buf;
     *     let totRead = 0;
     *     while (true) {
     *       const nread = await req.body.read(bufSlice);
     *       if (nread === null) break;
     *       totRead += nread;
     *       if (totRead >= req.contentLength) break;
     *       bufSlice = bufSlice.subarray(nread);
     *     }
     */
    get body() {
        if (!this._body) {
            if (this.contentLength != null) {
                this._body = bodyReader(this.contentLength, this.r);
            }
            else {
                const transferEncoding = this.headers.get("transfer-encoding");
                if (transferEncoding != null) {
                    const parts = transferEncoding
                        .split(",")
                        .map((e) => e.trim().toLowerCase());
                    assert(parts.includes("chunked"), 'transfer-encoding must include "chunked" if content-length is not set');
                    this._body = chunkedBodyReader(this.headers, this.r);
                }
                else {
                    // Neither content-length nor transfer-encoding: chunked
                    this._body = emptyReader();
                }
            }
        }
        return this._body;
    }
    async respond(r) {
        let err;
        try {
            // Write our response!
            await writeResponse(this.w, r);
        }
        catch (e) {
            try {
                // Eagerly close on error.
                this.conn.close();
            }
            catch { }
            err = e;
        }
        // Signal that this request has been processed and the next pipelined
        // request on the same connection can be accepted.
        this.done.resolve(err);
        if (err) {
            // Error during responding, rethrow.
            throw err;
        }
    }
    async finalize() {
        if (this.finalized)
            return;
        // Consume unread body
        const body = this.body;
        const buf = new Uint8Array(1024);
        while ((await body.read(buf)) !== null) { }
        this.finalized = true;
    }
}
export class Server {
    constructor(listener) {
        this.listener = listener;
        this.closing = false;
        this.connections = [];
    }
    close() {
        this.closing = true;
        this.listener.close();
        for (const conn of this.connections) {
            try {
                conn.close();
            }
            catch (e) {
                // Connection might have been already closed
                if (!(e instanceof Deno.errors.BadResource)) {
                    throw e;
                }
            }
        }
    }
    // Yields all HTTP requests on a single TCP connection.
    async *iterateHttpRequests(conn) {
        const reader = new BufReader(conn);
        const writer = new BufWriter(conn);
        while (!this.closing) {
            let request;
            try {
                request = await readRequest(conn, reader);
            }
            catch (error) {
                if (error instanceof Deno.errors.InvalidData ||
                    error instanceof Deno.errors.UnexpectedEof) {
                    // An error was thrown while parsing request headers.
                    await writeResponse(writer, {
                        status: 400,
                        body: encode(`${error.message}\r\n\r\n`),
                    });
                }
                break;
            }
            if (request === null) {
                break;
            }
            request.w = writer;
            yield request;
            // Wait for the request to be processed before we accept a new request on
            // this connection.
            const responseError = await request.done;
            if (responseError) {
                // Something bad happened during response.
                // (likely other side closed during pipelined req)
                // req.done implies this connection already closed, so we can just return.
                this.untrackConnection(request.conn);
                return;
            }
            // Consume unread body and trailers if receiver didn't consume those data
            await request.finalize();
        }
        this.untrackConnection(conn);
        try {
            conn.close();
        }
        catch (e) {
            // might have been already closed
        }
    }
    trackConnection(conn) {
        this.connections.push(conn);
    }
    untrackConnection(conn) {
        const index = this.connections.indexOf(conn);
        if (index !== -1) {
            this.connections.splice(index, 1);
        }
    }
    // Accepts a new TCP connection and yields all HTTP requests that arrive on
    // it. When a connection is accepted, it also creates a new iterator of the
    // same kind and adds it to the request multiplexer so that another TCP
    // connection can be accepted.
    async *acceptConnAndIterateHttpRequests(mux) {
        if (this.closing)
            return;
        // Wait for a new connection.
        let conn;
        try {
            conn = await this.listener.accept();
        }
        catch (error) {
            if (error instanceof Deno.errors.BadResource) {
                return;
            }
            throw error;
        }
        this.trackConnection(conn);
        // Try to accept another connection and add it to the multiplexer.
        mux.add(this.acceptConnAndIterateHttpRequests(mux));
        // Yield the requests that arrive on the just-accepted connection.
        yield* this.iterateHttpRequests(conn);
    }
    [Symbol.asyncIterator]() {
        const mux = new MuxAsyncIterator();
        mux.add(this.acceptConnAndIterateHttpRequests(mux));
        return mux.iterate();
    }
}
/**
 * Create a HTTP server
 *
 *     import { serve } from "https://deno.land/std/http/server.ts";
 *     const body = "Hello World\n";
 *     const s = serve({ port: 8000 });
 *     for await (const req of s) {
 *       req.respond({ body });
 *     }
 */
export function serve(addr) {
    if (typeof addr === "string") {
        const [hostname, port] = addr.split(":");
        addr = { hostname, port: Number(port) };
    }
    const listener = listen(addr);
    return new Server(listener);
}
/**
 * Start an HTTP server with given options and request handler
 *
 *     const body = "Hello World\n";
 *     const options = { port: 8000 };
 *     listenAndServe(options, (req) => {
 *       req.respond({ body });
 *     });
 *
 * @param options Server configuration
 * @param handler Request handler
 */
export async function listenAndServe(addr, handler) {
    const server = serve(addr);
    for await (const request of server) {
        handler(request);
    }
}
/**
 * Create an HTTPS server with given options
 *
 *     const body = "Hello HTTPS";
 *     const options = {
 *       hostname: "localhost",
 *       port: 443,
 *       certFile: "./path/to/localhost.crt",
 *       keyFile: "./path/to/localhost.key",
 *     };
 *     for await (const req of serveTLS(options)) {
 *       req.respond({ body });
 *     }
 *
 * @param options Server configuration
 * @return Async iterable server instance for incoming requests
 */
export function serveTLS(options) {
    const tlsOptions = {
        ...options,
        transport: "tcp",
    };
    const listener = listenTls(tlsOptions);
    return new Server(listener);
}
/**
 * Start an HTTPS server with given options and request handler
 *
 *     const body = "Hello HTTPS";
 *     const options = {
 *       hostname: "localhost",
 *       port: 443,
 *       certFile: "./path/to/localhost.crt",
 *       keyFile: "./path/to/localhost.key",
 *     };
 *     listenAndServeTLS(options, (req) => {
 *       req.respond({ body });
 *     });
 *
 * @param options Server configuration
 * @param handler Request handler
 */
export async function listenAndServeTLS(options, handler) {
    const server = serveTLS(options);
    for await (const request of server) {
        handler(request);
    }
}
//# sourceMappingURL=file:///C:/Users/kokou/workspace/typescript/deno-clean-architecture/deno_modules/gen/https/deno.land/std@0.53.0/http/server.ts.js.map