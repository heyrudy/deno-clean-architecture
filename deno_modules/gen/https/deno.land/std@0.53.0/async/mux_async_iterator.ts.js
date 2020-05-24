// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { deferred } from "./deferred.ts";
/** The MuxAsyncIterator class multiplexes multiple async iterators into a
 * single stream. It currently makes a few assumptions:
 * - The iterators do not throw.
 * - The final result (the value returned and not yielded from the iterator)
 *   does not matter; if there is any, it is discarded.
 */
export class MuxAsyncIterator {
    constructor() {
        this.iteratorCount = 0;
        this.yields = [];
        this.signal = deferred();
    }
    add(iterator) {
        ++this.iteratorCount;
        this.callIteratorNext(iterator);
    }
    async callIteratorNext(iterator) {
        const { value, done } = await iterator.next();
        if (done) {
            --this.iteratorCount;
        }
        else {
            this.yields.push({ iterator, value });
        }
        this.signal.resolve();
    }
    async *iterate() {
        while (this.iteratorCount > 0) {
            // Sleep until any of the wrapped iterators yields.
            await this.signal;
            // Note that while we're looping over `yields`, new items may be added.
            for (let i = 0; i < this.yields.length; i++) {
                const { iterator, value } = this.yields[i];
                yield value;
                this.callIteratorNext(iterator);
            }
            // Clear the `yields` list and reset the `signal` promise.
            this.yields.length = 0;
            this.signal = deferred();
        }
    }
    [Symbol.asyncIterator]() {
        return this.iterate();
    }
}
//# sourceMappingURL=file:///C:/Users/kokou/workspace/typescript/deno-clean-architecture/deno_modules/gen/https/deno.land/std@0.53.0/async/mux_async_iterator.ts.js.map