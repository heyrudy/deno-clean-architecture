// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
/** HTTP status codes */
export var Status;
(function (Status) {
    /** RFC 7231, 6.2.1 */
    Status[Status["Continue"] = 100] = "Continue";
    /** RFC 7231, 6.2.2 */
    Status[Status["SwitchingProtocols"] = 101] = "SwitchingProtocols";
    /** RFC 2518, 10.1 */
    Status[Status["Processing"] = 102] = "Processing";
    /** RFC 7231, 6.3.1 */
    Status[Status["OK"] = 200] = "OK";
    /** RFC 7231, 6.3.2 */
    Status[Status["Created"] = 201] = "Created";
    /** RFC 7231, 6.3.3 */
    Status[Status["Accepted"] = 202] = "Accepted";
    /** RFC 7231, 6.3.4 */
    Status[Status["NonAuthoritativeInfo"] = 203] = "NonAuthoritativeInfo";
    /** RFC 7231, 6.3.5 */
    Status[Status["NoContent"] = 204] = "NoContent";
    /** RFC 7231, 6.3.6 */
    Status[Status["ResetContent"] = 205] = "ResetContent";
    /** RFC 7233, 4.1 */
    Status[Status["PartialContent"] = 206] = "PartialContent";
    /** RFC 4918, 11.1 */
    Status[Status["MultiStatus"] = 207] = "MultiStatus";
    /** RFC 5842, 7.1 */
    Status[Status["AlreadyReported"] = 208] = "AlreadyReported";
    /** RFC 3229, 10.4.1 */
    Status[Status["IMUsed"] = 226] = "IMUsed";
    /** RFC 7231, 6.4.1 */
    Status[Status["MultipleChoices"] = 300] = "MultipleChoices";
    /** RFC 7231, 6.4.2 */
    Status[Status["MovedPermanently"] = 301] = "MovedPermanently";
    /** RFC 7231, 6.4.3 */
    Status[Status["Found"] = 302] = "Found";
    /** RFC 7231, 6.4.4 */
    Status[Status["SeeOther"] = 303] = "SeeOther";
    /** RFC 7232, 4.1 */
    Status[Status["NotModified"] = 304] = "NotModified";
    /** RFC 7231, 6.4.5 */
    Status[Status["UseProxy"] = 305] = "UseProxy";
    /** RFC 7231, 6.4.7 */
    Status[Status["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    /** RFC 7538, 3 */
    Status[Status["PermanentRedirect"] = 308] = "PermanentRedirect";
    /** RFC 7231, 6.5.1 */
    Status[Status["BadRequest"] = 400] = "BadRequest";
    /** RFC 7235, 3.1 */
    Status[Status["Unauthorized"] = 401] = "Unauthorized";
    /** RFC 7231, 6.5.2 */
    Status[Status["PaymentRequired"] = 402] = "PaymentRequired";
    /** RFC 7231, 6.5.3 */
    Status[Status["Forbidden"] = 403] = "Forbidden";
    /** RFC 7231, 6.5.4 */
    Status[Status["NotFound"] = 404] = "NotFound";
    /** RFC 7231, 6.5.5 */
    Status[Status["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    /** RFC 7231, 6.5.6 */
    Status[Status["NotAcceptable"] = 406] = "NotAcceptable";
    /** RFC 7235, 3.2 */
    Status[Status["ProxyAuthRequired"] = 407] = "ProxyAuthRequired";
    /** RFC 7231, 6.5.7 */
    Status[Status["RequestTimeout"] = 408] = "RequestTimeout";
    /** RFC 7231, 6.5.8 */
    Status[Status["Conflict"] = 409] = "Conflict";
    /** RFC 7231, 6.5.9 */
    Status[Status["Gone"] = 410] = "Gone";
    /** RFC 7231, 6.5.10 */
    Status[Status["LengthRequired"] = 411] = "LengthRequired";
    /** RFC 7232, 4.2 */
    Status[Status["PreconditionFailed"] = 412] = "PreconditionFailed";
    /** RFC 7231, 6.5.11 */
    Status[Status["RequestEntityTooLarge"] = 413] = "RequestEntityTooLarge";
    /** RFC 7231, 6.5.12 */
    Status[Status["RequestURITooLong"] = 414] = "RequestURITooLong";
    /** RFC 7231, 6.5.13 */
    Status[Status["UnsupportedMediaType"] = 415] = "UnsupportedMediaType";
    /** RFC 7233, 4.4 */
    Status[Status["RequestedRangeNotSatisfiable"] = 416] = "RequestedRangeNotSatisfiable";
    /** RFC 7231, 6.5.14 */
    Status[Status["ExpectationFailed"] = 417] = "ExpectationFailed";
    /** RFC 7168, 2.3.3 */
    Status[Status["Teapot"] = 418] = "Teapot";
    /** RFC 7540, 9.1.2 */
    Status[Status["MisdirectedRequest"] = 421] = "MisdirectedRequest";
    /** RFC 4918, 11.2 */
    Status[Status["UnprocessableEntity"] = 422] = "UnprocessableEntity";
    /** RFC 4918, 11.3 */
    Status[Status["Locked"] = 423] = "Locked";
    /** RFC 4918, 11.4 */
    Status[Status["FailedDependency"] = 424] = "FailedDependency";
    /** RFC 7231, 6.5.15 */
    Status[Status["UpgradeRequired"] = 426] = "UpgradeRequired";
    /** RFC 6585, 3 */
    Status[Status["PreconditionRequired"] = 428] = "PreconditionRequired";
    /** RFC 6585, 4 */
    Status[Status["TooManyRequests"] = 429] = "TooManyRequests";
    /** RFC 6585, 5 */
    Status[Status["RequestHeaderFieldsTooLarge"] = 431] = "RequestHeaderFieldsTooLarge";
    /** RFC 7725, 3 */
    Status[Status["UnavailableForLegalReasons"] = 451] = "UnavailableForLegalReasons";
    /** RFC 7231, 6.6.1 */
    Status[Status["InternalServerError"] = 500] = "InternalServerError";
    /** RFC 7231, 6.6.2 */
    Status[Status["NotImplemented"] = 501] = "NotImplemented";
    /** RFC 7231, 6.6.3 */
    Status[Status["BadGateway"] = 502] = "BadGateway";
    /** RFC 7231, 6.6.4 */
    Status[Status["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    /** RFC 7231, 6.6.5 */
    Status[Status["GatewayTimeout"] = 504] = "GatewayTimeout";
    /** RFC 7231, 6.6.6 */
    Status[Status["HTTPVersionNotSupported"] = 505] = "HTTPVersionNotSupported";
    /** RFC 2295, 8.1 */
    Status[Status["VariantAlsoNegotiates"] = 506] = "VariantAlsoNegotiates";
    /** RFC 4918, 11.5 */
    Status[Status["InsufficientStorage"] = 507] = "InsufficientStorage";
    /** RFC 5842, 7.2 */
    Status[Status["LoopDetected"] = 508] = "LoopDetected";
    /** RFC 2774, 7 */
    Status[Status["NotExtended"] = 510] = "NotExtended";
    /** RFC 6585, 6 */
    Status[Status["NetworkAuthenticationRequired"] = 511] = "NetworkAuthenticationRequired";
})(Status || (Status = {}));
export const STATUS_TEXT = new Map([
    [Status.Continue, "Continue"],
    [Status.SwitchingProtocols, "Switching Protocols"],
    [Status.Processing, "Processing"],
    [Status.OK, "OK"],
    [Status.Created, "Created"],
    [Status.Accepted, "Accepted"],
    [Status.NonAuthoritativeInfo, "Non-Authoritative Information"],
    [Status.NoContent, "No Content"],
    [Status.ResetContent, "Reset Content"],
    [Status.PartialContent, "Partial Content"],
    [Status.MultiStatus, "Multi-Status"],
    [Status.AlreadyReported, "Already Reported"],
    [Status.IMUsed, "IM Used"],
    [Status.MultipleChoices, "Multiple Choices"],
    [Status.MovedPermanently, "Moved Permanently"],
    [Status.Found, "Found"],
    [Status.SeeOther, "See Other"],
    [Status.NotModified, "Not Modified"],
    [Status.UseProxy, "Use Proxy"],
    [Status.TemporaryRedirect, "Temporary Redirect"],
    [Status.PermanentRedirect, "Permanent Redirect"],
    [Status.BadRequest, "Bad Request"],
    [Status.Unauthorized, "Unauthorized"],
    [Status.PaymentRequired, "Payment Required"],
    [Status.Forbidden, "Forbidden"],
    [Status.NotFound, "Not Found"],
    [Status.MethodNotAllowed, "Method Not Allowed"],
    [Status.NotAcceptable, "Not Acceptable"],
    [Status.ProxyAuthRequired, "Proxy Authentication Required"],
    [Status.RequestTimeout, "Request Timeout"],
    [Status.Conflict, "Conflict"],
    [Status.Gone, "Gone"],
    [Status.LengthRequired, "Length Required"],
    [Status.PreconditionFailed, "Precondition Failed"],
    [Status.RequestEntityTooLarge, "Request Entity Too Large"],
    [Status.RequestURITooLong, "Request URI Too Long"],
    [Status.UnsupportedMediaType, "Unsupported Media Type"],
    [Status.RequestedRangeNotSatisfiable, "Requested Range Not Satisfiable"],
    [Status.ExpectationFailed, "Expectation Failed"],
    [Status.Teapot, "I'm a teapot"],
    [Status.MisdirectedRequest, "Misdirected Request"],
    [Status.UnprocessableEntity, "Unprocessable Entity"],
    [Status.Locked, "Locked"],
    [Status.FailedDependency, "Failed Dependency"],
    [Status.UpgradeRequired, "Upgrade Required"],
    [Status.PreconditionRequired, "Precondition Required"],
    [Status.TooManyRequests, "Too Many Requests"],
    [Status.RequestHeaderFieldsTooLarge, "Request Header Fields Too Large"],
    [Status.UnavailableForLegalReasons, "Unavailable For Legal Reasons"],
    [Status.InternalServerError, "Internal Server Error"],
    [Status.NotImplemented, "Not Implemented"],
    [Status.BadGateway, "Bad Gateway"],
    [Status.ServiceUnavailable, "Service Unavailable"],
    [Status.GatewayTimeout, "Gateway Timeout"],
    [Status.HTTPVersionNotSupported, "HTTP Version Not Supported"],
    [Status.VariantAlsoNegotiates, "Variant Also Negotiates"],
    [Status.InsufficientStorage, "Insufficient Storage"],
    [Status.LoopDetected, "Loop Detected"],
    [Status.NotExtended, "Not Extended"],
    [Status.NetworkAuthenticationRequired, "Network Authentication Required"],
]);
//# sourceMappingURL=file:///C:/Users/kokou/workspace/typescript/deno-clean-architecture/deno_modules/gen/https/deno.land/std@0.53.0/http/http_status.ts.js.map