"use strict";
/**
 * Copyright (c) 2021 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("@testdeck/mocha");
const error_1 = require("./error");
const chai_1 = require("chai");
let TestApplicationError = class TestApplicationError {
    async ApplicationError_isUserDeletedError() {
        (0, chai_1.expect)(error_1.ApplicationError.isUserDeletedError(new error_1.ApplicationError(error_1.ErrorCodes.NOT_FOUND, "not found", { userDeleted: true }))).to.be.true;
    }
};
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestApplicationError.prototype, "ApplicationError_isUserDeletedError", null);
TestApplicationError = __decorate([
    mocha_1.suite
], TestApplicationError);
module.exports = new TestApplicationError();
//# sourceMappingURL=error.spec.js.map