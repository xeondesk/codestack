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
exports.ParseWorkspaceIdTest = void 0;
const chai = __importStar(require("chai"));
const mocha_1 = require("@testdeck/mocha");
const parse_workspace_id_1 = require("./parse-workspace-id");
const expect = chai.expect;
let ParseWorkspaceIdTest = class ParseWorkspaceIdTest {
    parseWorkspaceIdFromHostname_fromWorkspaceLocation() {
        const actual = (0, parse_workspace_id_1.parseWorkspaceIdFromHostname)("moccasin-ferret-155799b3.ws-eu01.codestack.io");
        expect(actual).to.equal("moccasin-ferret-155799b3");
    }
    parseWorkspaceIdFromHostname_fromWorkspacePortLocation() {
        const actual = (0, parse_workspace_id_1.parseWorkspaceIdFromHostname)("3000-moccasin-ferret-155799b3.ws-eu01.codestack.io");
        expect(actual).to.equal("moccasin-ferret-155799b3");
    }
    parseWorkspaceIdFromHostname_fromWorkspacePortLocationWithWebviewPrefix() {
        const actual = (0, parse_workspace_id_1.parseWorkspaceIdFromHostname)("webview-3000-moccasin-ferret-155799b3.ws-eu01.codestack.io");
        expect(actual).to.equal("moccasin-ferret-155799b3");
    }
    parseWorkspaceIdFromHostname_fromWorkspacePortLocationWithWebviewPrefixCustomHost() {
        const actual = (0, parse_workspace_id_1.parseWorkspaceIdFromHostname)("webview-3000-moccasin-ferret-155799b3.ws-eu01.some.subdomain.somehost.com");
        expect(actual).to.equal("moccasin-ferret-155799b3");
    }
    // legacy mode
    parseLegacyWorkspaceIdFromHostname_fromWorkspaceLocation() {
        const actual = (0, parse_workspace_id_1.parseWorkspaceIdFromHostname)("b7e0eaf8-ec73-44ec-81ea-04859263b656.ws-eu01.codestack.io");
        expect(actual).to.equal("b7e0eaf8-ec73-44ec-81ea-04859263b656");
    }
    parseLegacyWorkspaceIdFromHostname_fromWorkspacePortLocation() {
        const actual = (0, parse_workspace_id_1.parseWorkspaceIdFromHostname)("3000-b7e0eaf8-ec73-44ec-81ea-04859263b656.ws-eu01.codestack.io");
        expect(actual).to.equal("b7e0eaf8-ec73-44ec-81ea-04859263b656");
    }
    parseLegacyWorkspaceIdFromHostname_fromWorkspacePortLocationWithWebviewPrefix() {
        const actual = (0, parse_workspace_id_1.parseWorkspaceIdFromHostname)("webview-3000-b7e0eaf8-ec73-44ec-81ea-04859263b656.ws-eu01.codestack.io");
        expect(actual).to.equal("b7e0eaf8-ec73-44ec-81ea-04859263b656");
    }
    parseLegacyWorkspaceIdFromHostname_fromWorkspacePortLocationWithWebviewPrefixCustomHost() {
        const actual = (0, parse_workspace_id_1.parseWorkspaceIdFromHostname)("webview-3000-ca81a50f-09d7-465c-acd9-264a747d5351.ws-eu01.some.subdomain.somehost.com");
        expect(actual).to.equal("ca81a50f-09d7-465c-acd9-264a747d5351");
    }
    // match - instance ID
    matchesInstanceIdOrLegacyWorkspaceIdExactly_positive() {
        const actual = (0, parse_workspace_id_1.matchesInstanceIdOrLegacyWorkspaceIdExactly)("b7e0eaf8-ec73-44ec-81ea-04859263b656");
        expect(actual).to.be.true;
    }
    matchesInstanceIdOrLegacyWorkspaceIdExactly_negative() {
        const actual = (0, parse_workspace_id_1.matchesInstanceIdOrLegacyWorkspaceIdExactly)("b7e0eaf8-ec73-44ec-81a-04859263b656");
        expect(actual).to.be.false;
    }
    // match - new workspace ID
    matchesWorkspaceIdExactly_new_positive() {
        const actual = (0, parse_workspace_id_1.matchesNewWorkspaceIdExactly)("moccasin-ferret-155799b3");
        expect(actual).to.be.true;
    }
    matchesWorkspaceIdExactly_new_negative() {
        const actual = (0, parse_workspace_id_1.matchesNewWorkspaceIdExactly)("moccasin-ferret-15599b3");
        expect(actual).to.be.false;
    }
    isWorkspaceId_positive_new() {
        const actual = (0, parse_workspace_id_1.isWorkspaceId)("moccasin-ferret-155799b3");
        expect(actual).to.be.true;
    }
    isWorkspaceId_positive_legacy() {
        const actual = (0, parse_workspace_id_1.isWorkspaceId)("b7e0eaf8-ec73-44ec-81ea-04859263b656");
        expect(actual).to.be.true;
    }
    isWorkspaceId_negative_empty() {
        const actual = (0, parse_workspace_id_1.isWorkspaceId)(undefined);
        expect(actual).to.be.false;
    }
};
exports.ParseWorkspaceIdTest = ParseWorkspaceIdTest;
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ParseWorkspaceIdTest.prototype, "parseWorkspaceIdFromHostname_fromWorkspaceLocation", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ParseWorkspaceIdTest.prototype, "parseWorkspaceIdFromHostname_fromWorkspacePortLocation", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ParseWorkspaceIdTest.prototype, "parseWorkspaceIdFromHostname_fromWorkspacePortLocationWithWebviewPrefix", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ParseWorkspaceIdTest.prototype, "parseWorkspaceIdFromHostname_fromWorkspacePortLocationWithWebviewPrefixCustomHost", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ParseWorkspaceIdTest.prototype, "parseLegacyWorkspaceIdFromHostname_fromWorkspaceLocation", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ParseWorkspaceIdTest.prototype, "parseLegacyWorkspaceIdFromHostname_fromWorkspacePortLocation", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ParseWorkspaceIdTest.prototype, "parseLegacyWorkspaceIdFromHostname_fromWorkspacePortLocationWithWebviewPrefix", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ParseWorkspaceIdTest.prototype, "parseLegacyWorkspaceIdFromHostname_fromWorkspacePortLocationWithWebviewPrefixCustomHost", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ParseWorkspaceIdTest.prototype, "matchesInstanceIdOrLegacyWorkspaceIdExactly_positive", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ParseWorkspaceIdTest.prototype, "matchesInstanceIdOrLegacyWorkspaceIdExactly_negative", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ParseWorkspaceIdTest.prototype, "matchesWorkspaceIdExactly_new_positive", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ParseWorkspaceIdTest.prototype, "matchesWorkspaceIdExactly_new_negative", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ParseWorkspaceIdTest.prototype, "isWorkspaceId_positive_new", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ParseWorkspaceIdTest.prototype, "isWorkspaceId_positive_legacy", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ParseWorkspaceIdTest.prototype, "isWorkspaceId_negative_empty", null);
exports.ParseWorkspaceIdTest = ParseWorkspaceIdTest = __decorate([
    mocha_1.suite
], ParseWorkspaceIdTest);
module.exports = new ParseWorkspaceIdTest();
//# sourceMappingURL=parse-workspace-id.spec.js.map