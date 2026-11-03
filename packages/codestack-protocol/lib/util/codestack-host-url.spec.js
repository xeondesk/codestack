"use strict";
/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
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
exports.CodestackHostUrlTest = void 0;
const chai = __importStar(require("chai"));
const mocha_1 = require("@testdeck/mocha");
const codestack_host_url_1 = require("./codestack-host-url");
const expect = chai.expect;
let CodestackHostUrlTest = class CodestackHostUrlTest {
    parseWorkspaceId_hosts_withEnvVarsInjected() {
        const actual = new codestack_host_url_1.CodestackHostUrl("https://gray-grasshopper-nfbitfia.ws-eu02.codestack-staging.com/#passedin=test%20value/https://github.com/khulnasoft-bot/codestack-test-repo").workspaceId;
        expect(actual).to.equal("gray-grasshopper-nfbitfia");
    }
    async testWithoutWorkspacePrefix() {
        expect(new codestack_host_url_1.CodestackHostUrl("https://3000-moccasin-ferret-155799b3.ws-eu02.codestack-staging.com/")
            .withoutWorkspacePrefix()
            .toString()).to.equal("https://codestack-staging.com/");
    }
    async testWithoutWorkspacePrefix2() {
        expect(new codestack_host_url_1.CodestackHostUrl("https://codestack-staging.com/").withoutWorkspacePrefix().toString()).to.equal("https://codestack-staging.com/");
    }
    async testWithoutWorkspacePrefix3() {
        expect(new codestack_host_url_1.CodestackHostUrl("https://gray-rook-5523v5d8.ws-dev.my-branch-1234.staging.codestack-dev.com/")
            .withoutWorkspacePrefix()
            .toString()).to.equal("https://my-branch-1234.staging.codestack-dev.com/");
    }
    async testWithoutWorkspacePrefix4() {
        expect(new codestack_host_url_1.CodestackHostUrl("https://my-branch-1234.staging.codestack-dev.com/").withoutWorkspacePrefix().toString()).to.equal("https://my-branch-1234.staging.codestack-dev.com/");
    }
    async testWithoutWorkspacePrefix5() {
        expect(new codestack_host_url_1.CodestackHostUrl("https://abc-nice-brunch-4224.staging.codestack-dev.com/")
            .withoutWorkspacePrefix()
            .toString()).to.equal("https://abc-nice-brunch-4224.staging.codestack-dev.com/");
    }
    async testWithoutWorkspacePrefix6() {
        expect(new codestack_host_url_1.CodestackHostUrl("https://gray-rook-5523v5d8.ws-dev.abc-nice-brunch-4224.staging.codestack-dev.com/")
            .withoutWorkspacePrefix()
            .toString()).to.equal("https://abc-nice-brunch-4224.staging.codestack-dev.com/");
    }
};
exports.CodestackHostUrlTest = CodestackHostUrlTest;
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CodestackHostUrlTest.prototype, "parseWorkspaceId_hosts_withEnvVarsInjected", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CodestackHostUrlTest.prototype, "testWithoutWorkspacePrefix", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CodestackHostUrlTest.prototype, "testWithoutWorkspacePrefix2", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CodestackHostUrlTest.prototype, "testWithoutWorkspacePrefix3", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CodestackHostUrlTest.prototype, "testWithoutWorkspacePrefix4", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CodestackHostUrlTest.prototype, "testWithoutWorkspacePrefix5", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CodestackHostUrlTest.prototype, "testWithoutWorkspacePrefix6", null);
exports.CodestackHostUrlTest = CodestackHostUrlTest = __decorate([
    mocha_1.suite
], CodestackHostUrlTest);
module.exports = new CodestackHostUrlTest();
//# sourceMappingURL=codestack-host-url.spec.js.map