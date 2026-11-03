"use strict";
/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCodes = exports.ErrorCode = exports.ApplicationError = void 0;
const scrubbing_1 = require("../util/scrubbing");
class ApplicationError extends Error {
    constructor(code, message, data) {
        super(message);
        this.code = code;
        this.message = message;
        this.data = data;
        this.data = scrubbing_1.scrubber.scrub(this.data, true);
    }
    toJson() {
        return {
            code: this.code,
            message: this.message,
            data: this.data,
        };
    }
}
exports.ApplicationError = ApplicationError;
(function (ApplicationError) {
    function hasErrorCode(e) {
        return ErrorCode.is(e["code"]);
    }
    ApplicationError.hasErrorCode = hasErrorCode;
    async function notFoundToUndefined(p) {
        try {
            return await p;
        }
        catch (e) {
            if (hasErrorCode(e) && e.code === exports.ErrorCodes.NOT_FOUND) {
                return undefined;
            }
            throw e;
        }
    }
    ApplicationError.notFoundToUndefined = notFoundToUndefined;
    function isUserDeletedError(e) {
        var _a;
        return hasErrorCode(e) && e.code === exports.ErrorCodes.NOT_FOUND && ((_a = e.data) === null || _a === void 0 ? void 0 : _a.userDeleted) === true;
    }
    ApplicationError.isUserDeletedError = isUserDeletedError;
})(ApplicationError || (exports.ApplicationError = ApplicationError = {}));
var ErrorCode;
(function (ErrorCode) {
    function isUserError(code) {
        return code >= 400 && code < 500;
    }
    ErrorCode.isUserError = isUserError;
    function is(code) {
        if (typeof code !== "number") {
            return false;
        }
        return Object.values(exports.ErrorCodes).includes(code);
    }
    ErrorCode.is = is;
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
exports.ErrorCodes = {
    // 400 Unauthorized
    BAD_REQUEST: 400,
    // 401 Unauthorized
    NOT_AUTHENTICATED: 401,
    // 403 Forbidden
    PERMISSION_DENIED: 403,
    // 404 Not Found
    NOT_FOUND: 404,
    // 409 Conflict (e.g. already existing)
    CONFLICT: 409,
    // 411 No User
    NEEDS_VERIFICATION: 411,
    // 412 Precondition Failed
    PRECONDITION_FAILED: 412,
    // 429 Too Many Requests
    TOO_MANY_REQUESTS: 429,
    // 430 Repository not whitelisted (custom status code)
    REPOSITORY_NOT_WHITELISTED: 430,
    // 451 Out of credits
    PAYMENT_SPENDING_LIMIT_REACHED: 451,
    // 451 Error creating a subscription
    SUBSCRIPTION_ERROR: 452,
    // 455 Invalid cost center (custom status code)
    INVALID_COST_CENTER: 455,
    // 460 Context Parse Error (custom status code)
    CONTEXT_PARSE_ERROR: 460,
    // 461 Invalid codestack yml (custom status code)
    INVALID_CODESTACK_YML: 461,
    // 470 User Blocked (custom status code)
    USER_BLOCKED: 470,
    // 472 Terms Acceptance Required (custom status code)
    USER_TERMS_ACCEPTANCE_REQUIRED: 472,
    // 481 Professional plan is required for this operation
    PLAN_PROFESSIONAL_REQUIRED: 481,
    // 482 Cell Expired
    CELL_EXPIRED: 482,
    // 490 Too Many Running Workspace
    TOO_MANY_RUNNING_WORKSPACES: 490,
    // 498 The operation was cancelled, typically by the caller.
    CANCELLED: 498,
    // 4981 The deadline expired before the operation could complete.
    DEADLINE_EXCEEDED: 4981,
    // 500 Internal Server Error
    INTERNAL_SERVER_ERROR: 500,
    // 501 EE Feature
    EE_FEATURE: 501,
    // 521 Unimplemented
    UNIMPLEMENTED: 521,
    // 555 EE License Required
    EE_LICENSE_REQUIRED: 555,
    // 601 SaaS Feature
    SAAS_FEATURE: 601,
    // 630 Snapshot Error
    SNAPSHOT_ERROR: 630,
    // 640 Headless logs are not available (yet)
    HEADLESS_LOG_NOT_YET_AVAILABLE: 640,
    // 650 Invalid Value
    INVALID_VALUE: 650,
};
//# sourceMappingURL=error.js.map