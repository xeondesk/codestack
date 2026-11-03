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
const _1 = require(".");
const expect = chai.expect;
let TestSnapshotUrlParser = class TestSnapshotUrlParser {
    testPositive() {
        const actual = _1.SnapshotUrl.parse("workspaces/c362d434-6faa-4ce0-9ad4-91b4a87c4abe/3f0556f7-4afa-11e9-98d5-52f8983b9279.tar@codestack-prodcopy-user-e1e28f18-0354-4a5d-b6b4-8879a2ff73fd");
        expect(actual).to.deep.equal({
            bucketId: "codestack-prodcopy-user-e1e28f18-0354-4a5d-b6b4-8879a2ff73fd",
            filename: "3f0556f7-4afa-11e9-98d5-52f8983b9279.tar",
            fullPath: "workspaces/c362d434-6faa-4ce0-9ad4-91b4a87c4abe/3f0556f7-4afa-11e9-98d5-52f8983b9279.tar",
        });
    }
};
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestSnapshotUrlParser.prototype, "testPositive", null);
TestSnapshotUrlParser = __decorate([
    mocha_1.suite
], TestSnapshotUrlParser);
module.exports = new TestSnapshotUrlParser(); // Only to circumvent no usage warning :-/
//# sourceMappingURL=snapshot-url.spec.js.map