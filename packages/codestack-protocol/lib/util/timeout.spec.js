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
exports.TimeoutSpec = void 0;
const chai = __importStar(require("chai"));
const expect = chai.expect;
const mocha_1 = require("@testdeck/mocha");
const timeout_1 = require("./timeout");
let TimeoutSpec = class TimeoutSpec {
    async testSimpleRun() {
        var _a;
        const timeout = new timeout_1.Timeout(1);
        timeout.start();
        await timeout.await();
        expect((_a = timeout.signal) === null || _a === void 0 ? void 0 : _a.aborted).to.be.true;
    }
    async testSimpleRunNotStarted() {
        const timeout = new timeout_1.Timeout(1);
        await timeout.await();
        expect(timeout.signal).to.be.undefined;
    }
    async testRestart() {
        var _a, _b, _c;
        const timeout = new timeout_1.Timeout(20);
        timeout.start();
        await timeout.await();
        expect((_a = timeout.signal) === null || _a === void 0 ? void 0 : _a.aborted).to.be.true;
        timeout.restart();
        expect(timeout.signal).to.not.be.undefined;
        expect((_b = timeout.signal) === null || _b === void 0 ? void 0 : _b.aborted).to.be.false;
        await timeout.await();
        expect((_c = timeout.signal) === null || _c === void 0 ? void 0 : _c.aborted).to.be.true;
    }
    async testClear() {
        const timeout = new timeout_1.Timeout(1000);
        timeout.restart();
        timeout.clear();
        expect(timeout.signal).to.be.undefined;
    }
    async testAbortCondition() {
        var _a;
        const timeout = new timeout_1.Timeout(1, () => false); // will never trigger abort
        timeout.start();
        await new Promise((resolve) => setTimeout(resolve, 50));
        expect(timeout.signal).to.not.be.undefined;
        expect((_a = timeout.signal) === null || _a === void 0 ? void 0 : _a.aborted).to.be.false;
    }
};
exports.TimeoutSpec = TimeoutSpec;
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TimeoutSpec.prototype, "testSimpleRun", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TimeoutSpec.prototype, "testSimpleRunNotStarted", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TimeoutSpec.prototype, "testRestart", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TimeoutSpec.prototype, "testClear", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TimeoutSpec.prototype, "testAbortCondition", null);
exports.TimeoutSpec = TimeoutSpec = __decorate([
    (0, mocha_1.suite)()
], TimeoutSpec);
//# sourceMappingURL=timeout.spec.js.map