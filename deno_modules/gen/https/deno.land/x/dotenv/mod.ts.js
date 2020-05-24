import { compact, difference, trim } from "./util.ts";
export function parse(rawDotenv) {
    return rawDotenv.split("\n").reduce((acc, line) => {
        if (!isVariableStart(line))
            return acc;
        let [key, ...vals] = removeSpacesAroundEquals(line).split("=");
        let value = vals.join("=");
        if (/^"/.test(value)) {
            value = expandNewlines(value);
        }
        acc[key] = trim(cleanQuotes(value));
        return acc;
    }, {});
}
export function config(options = {}) {
    const o = Object.assign({
        path: `${Deno.cwd()}/.env`,
        export: false,
        safe: false,
        example: `${Deno.cwd()}/.env.example`,
        allowEmptyValues: false,
    }, options);
    const conf = parseFile(o.path);
    if (o.safe) {
        const confExample = parseFile(o.example);
        assertSafe(conf, confExample, o.allowEmptyValues);
    }
    if (o.export) {
        for (let key in conf) {
            Deno.env.set(key, conf[key]);
        }
    }
    return conf;
}
function parseFile(filepath) {
    return parse(new TextDecoder("utf-8").decode(Deno.readFileSync(filepath)));
}
function isVariableStart(str) {
    return /^[a-zA-Z_ ]*=/.test(str);
}
function cleanQuotes(value = "") {
    return value.replace(/^['"]([\s\S]*)['"]$/gm, "$1");
}
function removeSpacesAroundEquals(str) {
    return str.replace(/( *= *)/, "=");
}
function expandNewlines(str) {
    return str.replace("\\n", "\n");
}
function assertSafe(conf, confExample, allowEmptyValues) {
    const currentEnv = Deno.env.toObject();
    // Not all the variables have to be defined in .env, they can be supplied externally
    const confWithEnv = Object.assign({}, currentEnv, conf);
    const missing = difference(Object.keys(confExample), 
    // If allowEmptyValues is false, filter out empty values from configuration
    Object.keys(allowEmptyValues ? confWithEnv : compact(confWithEnv)));
    if (missing.length > 0) {
        const errorMessages = [
            `The following variables were defined in the example file but are not present in the environment:\n  ${missing.join(", ")}`,
            `Make sure to add them to your env file.`,
            !allowEmptyValues &&
                `If you expect any of these variables to be empty, you can set the allowEmptyValues option to true.`,
        ];
        throw new MissingEnvVarsError(errorMessages.filter(Boolean).join("\n\n"));
    }
}
export class MissingEnvVarsError extends Error {
    constructor(message) {
        super(message);
        this.name = "MissingEnvVarsError";
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
//# sourceMappingURL=file:///C:/Users/kokou/workspace/typescript/deno-clean-architecture/deno_modules/gen/https/deno.land/x/dotenv/mod.ts.js.map