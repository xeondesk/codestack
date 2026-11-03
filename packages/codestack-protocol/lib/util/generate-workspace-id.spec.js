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
const mocha_1 = require("@testdeck/mocha");
const chai = __importStar(require("chai"));
const generate_workspace_id_1 = require("./generate-workspace-id");
const codestack_host_url_1 = require("./codestack-host-url");
const expect = chai.expect;
let TestGenerateWorkspaceId = class TestGenerateWorkspaceId {
    async testGenerateWorkspaceId() {
        for (let i = 0; i < 10; i++) {
            const id = await (0, generate_workspace_id_1.generateWorkspaceID)();
            expect(new codestack_host_url_1.CodestackHostUrl("https://codestack.io").withWorkspacePrefix(id, "eu").workspaceId).to.equal(id);
        }
    }
    testLongestName() {
        const longestColor = generate_workspace_id_1.colors.sort((a, b) => b.length - a.length)[0];
        const longestAnimal = generate_workspace_id_1.animals.sort((a, b) => b.length - a.length)[0];
        const longestName = `${longestColor}-${longestAnimal}-12345678`;
        expect(longestName.length <= 36, `"${longestName}" is longer than 36 chars (${longestName.length})`).to.be.true;
    }
    async testCustomName() {
        const data = [
            ["foo", "bar", "foo-bar-"],
            ["f", "bar", ".{2,16}-bar-"],
            ["codestack-io", "codestack", "codestackio-codestack-"],
            ["breatheco-de", "python-flask-api-tutorial", "breathecode-pythonflask-"],
            ["short", "muchlongerthaneleven", "short-muchlongerthanel-"],
            ["muchlongerthaneleven", "short", "muchlongerthanel-short-"],
            [
                'this is rather long and has some "§$"% special chars',
                "also here pretty long and needs abbreviation",
                "thisisrathe-alsoherepre-",
            ],
            ["UPPER", "CaSe", "upper-case-"],
            [
                "superlongfirstsegment",
                "---------",
                "superlong" /* we don't mantch for the whole first segment, because it has different length depending on the animal that is used to replace the -------*/,
            ],
        ];
        for (const d of data) {
            const id = await (0, generate_workspace_id_1.generateWorkspaceID)(d[0], d[1]);
            expect(id).match(new RegExp("^" + d[2]));
            expect(new codestack_host_url_1.CodestackHostUrl("https://codestack.io").withWorkspacePrefix(id, "eu").workspaceId).to.equal(id);
            expect(id.length <= 36, `"${id}" is longer than 36 chars (${id.length})`).to.be.true;
        }
    }
};
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestGenerateWorkspaceId.prototype, "testGenerateWorkspaceId", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestGenerateWorkspaceId.prototype, "testLongestName", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestGenerateWorkspaceId.prototype, "testCustomName", null);
TestGenerateWorkspaceId = __decorate([
    mocha_1.suite
], TestGenerateWorkspaceId);
module.exports = new TestGenerateWorkspaceId();
//# sourceMappingURL=generate-workspace-id.spec.js.map