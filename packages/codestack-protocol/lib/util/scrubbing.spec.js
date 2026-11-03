"use strict";
/**
 * Copyright (c) 2023 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrubbingTest = void 0;
const chai = __importStar(require("chai"));
const mocha_1 = require("@testdeck/mocha");
const scrubbing_1 = require("./scrubbing");
const expect = chai.expect;
let ScrubbingTest = class ScrubbingTest {
    testValue_EmptyString() {
        expect(scrubbing_1.scrubber.scrub("")).to.equal("");
    }
    testValue_Email() {
        expect(scrubbing_1.scrubber.scrub("foo@bar.com")).to.equal("[redacted:email]");
    }
    testValue_EmailInText() {
        expect(scrubbing_1.scrubber.scrub("The email is foo@bar.com or bar@foo.com")).to.equal("The email is [redacted:email] or [redacted:email]");
    }
    testKeyValue_Email() {
        expect(scrubbing_1.scrubber.scrub({ email: "testvalue" })).to.deep.equal({ email: "[redacted]" });
    }
    testKeyValue_AuthorEmail() {
        expect(scrubbing_1.scrubber.scrub({ author_email: "testvalue" })).to.deep.equal({ author_email: "[redacted]" });
    }
    testKeyValue_Token() {
        expect(scrubbing_1.scrubber.scrub({ token: "testvalue" })).to.deep.equal({ token: "[redacted]" });
    }
    testKeyValue_OwnerToken() {
        expect(scrubbing_1.scrubber.scrub({ owner_token: "testvalue" })).to.deep.equal({ owner_token: "[redacted]" });
    }
    testKeyValue_NestedObject() {
        expect(scrubbing_1.scrubber.scrub({ key: { owner_token: "testvalue" } }, true)).to.deep.equal({
            key: { owner_token: "[redacted]" },
        });
    }
    testKeyValue_NoNestedObject() {
        expect(scrubbing_1.scrubber.scrub({ key: { owner_token: "testvalue" } }, false)).to.deep.equal({
            key: "[redacted:nested:object}]",
        });
    }
    testKeyValue_NestedArray() {
        expect(scrubbing_1.scrubber.scrub([["foo@bar.com"]])).to.deep.equal([["[redacted:email]"]]);
    }
    testKeyValue_NoNestedArray() {
        expect(scrubbing_1.scrubber.scrub([["foo@bar.com"]], false)).to.deep.equal(["[redacted:nested:array]"]);
    }
    testKeyValue_Scrubbable() {
        const scrubbedValue = new scrubbing_1.TrustedValue(scrubbing_1.scrubber.scrubValue("foo@bar.com"));
        expect(scrubbing_1.scrubber.scrub({ key: scrubbedValue })).to.deep.equal({ key: "[redacted:email]" });
    }
    testAnalyticsProperties_URLScrubbing() {
        // Test case that mirrors the analytics.track() usage pattern
        const mockInstance = {
            id: "test-instance-123",
            workspaceId: "test-workspace-456",
            stoppingTime: "2023-01-01T00:00:00.000Z",
            status: {
                conditions: [
                    {
                        message: "Content initialization failed: cannot initialize workspace: git initializer gitClone: git clone --depth=1 --shallow-submodules https://gitlab.com/acme-corp/web/frontend/services/deployment-manager.git --config http.version=HTTP/1.1 . failed (exit status 128):",
                    },
                    {
                        message: "Another error with URL: https://github.com/user/repo.git",
                    },
                    {
                        message: "Error without URL",
                    },
                    {
                        message: "API call to https://api.example.com/endpoint failed",
                    },
                ],
                timeout: false,
            },
        };
        // This mirrors the exact usage in workspace-instance-controller.ts
        const scrubbedProperties = scrubbing_1.scrubber.scrub({
            instanceId: mockInstance.id,
            workspaceId: mockInstance.workspaceId,
            stoppingTime: new Date(mockInstance.stoppingTime),
            conditions: mockInstance.status.conditions,
            timeout: mockInstance.status.timeout,
        });
        // Verify workspaceId is hashed (field-based scrubbing)
        expect(scrubbedProperties.workspaceId).to.match(/^\[redacted:md5:[a-f0-9]{32}\]$/);
        // Verify instanceId is not scrubbed (not in sensitive fields)
        expect(scrubbedProperties.instanceId).to.equal("test-instance-123");
        // Verify URLs in nested conditions are hashed (pattern-based scrubbing)
        expect(scrubbedProperties.conditions[0].message).to.include("[redacted:md5:");
        expect(scrubbedProperties.conditions[0].message).to.include(":url]");
        expect(scrubbedProperties.conditions[0].message).to.not.include("gitlab.com");
        expect(scrubbedProperties.conditions[1].message).to.include("[redacted:md5:");
        expect(scrubbedProperties.conditions[1].message).to.include(":url]");
        expect(scrubbedProperties.conditions[1].message).to.not.include("github.com");
        // Verify non-URL message is unchanged
        expect(scrubbedProperties.conditions[2].message).to.equal("Error without URL");
        // Verify non-.git URL is NOT scrubbed
        expect(scrubbedProperties.conditions[3].message).to.equal("API call to https://api.example.com/endpoint failed");
        expect(scrubbedProperties.conditions[3].message).to.not.include("[redacted:md5:");
        // Verify other properties are preserved
        expect(scrubbedProperties.timeout).to.equal(false);
        // Date objects get converted to empty objects by the scrubber since they don't have enumerable properties
        expect(scrubbedProperties.stoppingTime).to.be.an("object");
    }
    testURL_PatternScrubbing() {
        // Test individual URL scrubbing for .git URLs
        const urlMessage = "git clone https://gitlab.com/acme-corp/web/frontend/services/deployment-manager.git failed";
        const scrubbedMessage = scrubbing_1.scrubber.scrubValue(urlMessage);
        expect(scrubbedMessage).to.include("[redacted:md5:");
        expect(scrubbedMessage).to.include(":url]");
        expect(scrubbedMessage).to.not.include("gitlab.com");
        expect(scrubbedMessage).to.include("git clone");
        expect(scrubbedMessage).to.include("failed");
    }
    testURL_NonGitURLsNotScrubbed() {
        // Test that non-.git URLs are NOT scrubbed
        const apiMessage = "API call to https://api.example.com/endpoint failed";
        const scrubbedMessage = scrubbing_1.scrubber.scrubValue(apiMessage);
        // Non-.git URLs should remain unchanged
        expect(scrubbedMessage).to.equal("API call to https://api.example.com/endpoint failed");
        expect(scrubbedMessage).to.not.include("[redacted:md5:");
    }
    testURL_MixedURLTypes() {
        // Test message with both .git and non-.git URLs
        const mixedMessage = "Clone from https://github.com/user/repo.git then visit https://docs.codestack.io/configure";
        const scrubbedMessage = scrubbing_1.scrubber.scrubValue(mixedMessage);
        // .git URL should be scrubbed
        expect(scrubbedMessage).to.include("[redacted:md5:");
        expect(scrubbedMessage).to.include(":url]");
        expect(scrubbedMessage).to.not.include("github.com/user/repo.git");
        // Non-.git URL should remain unchanged
        expect(scrubbedMessage).to.include("https://docs.codestack.io/configure");
    }
    testURL_HttpGitURLs() {
        // Test that http:// .git URLs are also scrubbed
        const httpMessage = "git clone http://internal-git.company.com/project.git";
        const scrubbedMessage = scrubbing_1.scrubber.scrubValue(httpMessage);
        expect(scrubbedMessage).to.include("[redacted:md5:");
        expect(scrubbedMessage).to.include(":url]");
        expect(scrubbedMessage).to.not.include("internal-git.company.com");
    }
};
exports.ScrubbingTest = ScrubbingTest;
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScrubbingTest.prototype, "testValue_EmptyString", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScrubbingTest.prototype, "testValue_Email", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScrubbingTest.prototype, "testValue_EmailInText", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScrubbingTest.prototype, "testKeyValue_Email", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScrubbingTest.prototype, "testKeyValue_AuthorEmail", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScrubbingTest.prototype, "testKeyValue_Token", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScrubbingTest.prototype, "testKeyValue_OwnerToken", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScrubbingTest.prototype, "testKeyValue_NestedObject", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScrubbingTest.prototype, "testKeyValue_NoNestedObject", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScrubbingTest.prototype, "testKeyValue_NestedArray", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScrubbingTest.prototype, "testKeyValue_NoNestedArray", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScrubbingTest.prototype, "testKeyValue_Scrubbable", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScrubbingTest.prototype, "testAnalyticsProperties_URLScrubbing", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScrubbingTest.prototype, "testURL_PatternScrubbing", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScrubbingTest.prototype, "testURL_NonGitURLsNotScrubbed", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScrubbingTest.prototype, "testURL_MixedURLTypes", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScrubbingTest.prototype, "testURL_HttpGitURLs", null);
exports.ScrubbingTest = ScrubbingTest = __decorate([
    mocha_1.suite
], ScrubbingTest);
module.exports = new ScrubbingTest();
//# sourceMappingURL=scrubbing.spec.js.map