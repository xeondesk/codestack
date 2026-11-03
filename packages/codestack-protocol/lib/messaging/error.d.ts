/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
export declare class ApplicationError extends Error {
    readonly code: ErrorCode;
    readonly message: string;
    readonly data?: any | undefined;
    constructor(code: ErrorCode, message: string, data?: any | undefined);
    toJson(): {
        code: ErrorCode;
        message: string;
        data: any;
    };
}
export declare namespace ApplicationError {
    function hasErrorCode(e: any): e is Error & {
        code: ErrorCode;
        data?: any;
    };
    function notFoundToUndefined<T>(p: Promise<T>): Promise<T | undefined>;
    function isUserDeletedError(e: any): boolean;
}
export declare namespace ErrorCode {
    function isUserError(code: number | ErrorCode): boolean;
    function is(code: any): code is ErrorCode;
}
export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];
export declare const ErrorCodes: {
    BAD_REQUEST: 400;
    NOT_AUTHENTICATED: 401;
    PERMISSION_DENIED: 403;
    NOT_FOUND: 404;
    CONFLICT: 409;
    NEEDS_VERIFICATION: 411;
    PRECONDITION_FAILED: 412;
    TOO_MANY_REQUESTS: 429;
    REPOSITORY_NOT_WHITELISTED: 430;
    PAYMENT_SPENDING_LIMIT_REACHED: 451;
    SUBSCRIPTION_ERROR: 452;
    INVALID_COST_CENTER: 455;
    CONTEXT_PARSE_ERROR: 460;
    INVALID_CODESTACK_YML: 461;
    USER_BLOCKED: 470;
    USER_TERMS_ACCEPTANCE_REQUIRED: 472;
    PLAN_PROFESSIONAL_REQUIRED: 481;
    CELL_EXPIRED: 482;
    TOO_MANY_RUNNING_WORKSPACES: 490;
    CANCELLED: 498;
    DEADLINE_EXCEEDED: 4981;
    INTERNAL_SERVER_ERROR: 500;
    EE_FEATURE: 501;
    UNIMPLEMENTED: 521;
    EE_LICENSE_REQUIRED: 555;
    SAAS_FEATURE: 601;
    SNAPSHOT_ERROR: 630;
    HEADLESS_LOG_NOT_YET_AVAILABLE: 640;
    INVALID_VALUE: 650;
};
//# sourceMappingURL=error.d.ts.map