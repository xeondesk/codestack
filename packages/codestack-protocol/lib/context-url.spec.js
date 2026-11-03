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
exports.ContextUrlTest = void 0;
const chai = __importStar(require("chai"));
const mocha_1 = require("@testdeck/mocha");
const context_url_1 = require("./context-url");
const expect = chai.expect;
let ContextUrlTest = class ContextUrlTest {
    parseContextUrl_withEnvVar() {
        const actual = context_url_1.ContextURL.getNormalizedURL({
            contextURL: "passedin=test%20value/https://github.com/khulnasoft-bot/codestack-test-repo",
            context: {},
        });
        expect(actual === null || actual === void 0 ? void 0 : actual.host).to.equal("github.com");
        expect(actual === null || actual === void 0 ? void 0 : actual.pathname).to.equal("/khulnasoft-bot/codestack-test-repo");
    }
    parseContextUrl_withEnvVar_withoutSchema() {
        const actual = context_url_1.ContextURL.getNormalizedURL({
            contextURL: "passedin=test%20value/github.com/khulnasoft-bot/codestack-test-repo",
            context: {},
        });
        expect(actual === null || actual === void 0 ? void 0 : actual.host).to.equal("github.com");
        expect(actual === null || actual === void 0 ? void 0 : actual.pathname).to.equal("/khulnasoft-bot/codestack-test-repo");
    }
    parseContextUrl_withEnvVar_sshUrl() {
        const actual = context_url_1.ContextURL.getNormalizedURL({
            contextURL: "passedin=test%20value/git@github.com:khulnasoft-bot/codestack-test-repo.git",
            context: {},
        });
        expect(actual === null || actual === void 0 ? void 0 : actual.host).to.equal("github.com");
        expect(actual === null || actual === void 0 ? void 0 : actual.pathname).to.equal("/khulnasoft-bot/codestack-test-repo.git");
    }
    parseContextUrl_badUrl() {
        const actual = context_url_1.ContextURL.getNormalizedURL({ contextURL: "[Object object]", context: {} });
        expect(actual).to.be.undefined;
    }
};
exports.ContextUrlTest = ContextUrlTest;
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ContextUrlTest.prototype, "parseContextUrl_withEnvVar", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ContextUrlTest.prototype, "parseContextUrl_withEnvVar_withoutSchema", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ContextUrlTest.prototype, "parseContextUrl_withEnvVar_sshUrl", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ContextUrlTest.prototype, "parseContextUrl_badUrl", null);
exports.ContextUrlTest = ContextUrlTest = __decorate([
    mocha_1.suite
], ContextUrlTest);
module.exports = new ContextUrlTest();
//# sourceMappingURL=context-url.spec.js.map