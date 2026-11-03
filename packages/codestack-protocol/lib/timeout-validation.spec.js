"use strict";
/**
 * Copyright (c) 2025 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const codestack_service_1 = require("./codestack-service");
describe("WorkspaceTimeoutDuration", () => {
    describe("validate", () => {
        it("should handle single unit durations correctly", () => {
            (0, chai_1.expect)(codestack_service_1.WorkspaceTimeoutDuration.validate("30m")).to.equal("30m");
            (0, chai_1.expect)(codestack_service_1.WorkspaceTimeoutDuration.validate("60m")).to.equal("60m");
            (0, chai_1.expect)(codestack_service_1.WorkspaceTimeoutDuration.validate("90m")).to.equal("90m");
            (0, chai_1.expect)(codestack_service_1.WorkspaceTimeoutDuration.validate("1h")).to.equal("1h");
            (0, chai_1.expect)(codestack_service_1.WorkspaceTimeoutDuration.validate("2h")).to.equal("2h");
        });
        it("should handle mixed unit durations correctly (bug fix)", () => {
            // These were the bug cases that were incorrectly parsed
            (0, chai_1.expect)(codestack_service_1.WorkspaceTimeoutDuration.validate("1h30m")).to.equal("1h30m");
            (0, chai_1.expect)(codestack_service_1.WorkspaceTimeoutDuration.validate("2h15m")).to.equal("2h15m");
            (0, chai_1.expect)(codestack_service_1.WorkspaceTimeoutDuration.validate("3h45m")).to.equal("3h45m");
            (0, chai_1.expect)(codestack_service_1.WorkspaceTimeoutDuration.validate("1h1m")).to.equal("1h1m");
            (0, chai_1.expect)(codestack_service_1.WorkspaceTimeoutDuration.validate("2h59m")).to.equal("2h59m");
        });
        it("should handle complex Go duration formats", () => {
            (0, chai_1.expect)(codestack_service_1.WorkspaceTimeoutDuration.validate("1h30m45s")).to.equal("1h30m45s");
            (0, chai_1.expect)(codestack_service_1.WorkspaceTimeoutDuration.validate("1m30s")).to.equal("1m30s");
            // Note: parse-duration doesn't support decimal durations like "1.5h"
        });
        it("should handle edge cases within limits", () => {
            (0, chai_1.expect)(codestack_service_1.WorkspaceTimeoutDuration.validate("24h")).to.equal("24h");
            (0, chai_1.expect)(codestack_service_1.WorkspaceTimeoutDuration.validate("23h59m")).to.equal("23h59m");
            (0, chai_1.expect)(codestack_service_1.WorkspaceTimeoutDuration.validate("1440m")).to.equal("1440m"); // 24 hours in minutes
        });
        it("should reject durations exceeding 24 hours", () => {
            (0, chai_1.expect)(() => codestack_service_1.WorkspaceTimeoutDuration.validate("25h")).to.throw("Workspace inactivity timeout cannot exceed 24h");
            (0, chai_1.expect)(() => codestack_service_1.WorkspaceTimeoutDuration.validate("1441m")).to.throw("Workspace inactivity timeout cannot exceed 24h");
            (0, chai_1.expect)(() => codestack_service_1.WorkspaceTimeoutDuration.validate("24h1m")).to.throw("Workspace inactivity timeout cannot exceed 24h");
        });
        it("should reject invalid formats", () => {
            (0, chai_1.expect)(() => codestack_service_1.WorkspaceTimeoutDuration.validate("invalid")).to.throw("Invalid timeout format");
            (0, chai_1.expect)(() => codestack_service_1.WorkspaceTimeoutDuration.validate("1x")).to.throw("Invalid timeout format");
            (0, chai_1.expect)(() => codestack_service_1.WorkspaceTimeoutDuration.validate("")).to.throw("Invalid timeout format");
            (0, chai_1.expect)(() => codestack_service_1.WorkspaceTimeoutDuration.validate("1")).to.throw("Invalid timeout format");
            (0, chai_1.expect)(() => codestack_service_1.WorkspaceTimeoutDuration.validate("5hrs")).to.throw("Invalid timeout format");
            (0, chai_1.expect)(() => codestack_service_1.WorkspaceTimeoutDuration.validate("24hrs")).to.throw("Invalid timeout format");
            (0, chai_1.expect)(() => codestack_service_1.WorkspaceTimeoutDuration.validate("1hr")).to.throw("Invalid timeout format");
        });
        it("should handle case insensitivity", () => {
            (0, chai_1.expect)(codestack_service_1.WorkspaceTimeoutDuration.validate("1H30M")).to.equal("1h30m");
            (0, chai_1.expect)(codestack_service_1.WorkspaceTimeoutDuration.validate("90M")).to.equal("90m");
        });
        it("should trim whitespace", () => {
            (0, chai_1.expect)(codestack_service_1.WorkspaceTimeoutDuration.validate(" 5h ")).to.equal("5h");
        });
        it("should reject zero or negative durations", () => {
            // Note: Go duration format doesn't support negative durations in the format we accept
            // Zero duration components are handled by the totalMinutes > 0 check
            (0, chai_1.expect)(() => codestack_service_1.WorkspaceTimeoutDuration.validate("0m")).to.throw("Invalid timeout value");
            (0, chai_1.expect)(() => codestack_service_1.WorkspaceTimeoutDuration.validate("0h")).to.throw("Invalid timeout value");
        });
    });
});
//# sourceMappingURL=timeout-validation.spec.js.map