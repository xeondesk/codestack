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
const mocha_1 = require("@testdeck/mocha");
const chai = __importStar(require("chai"));
const protocol_1 = require("./protocol");
const expect = chai.expect;
let TestUserEnvVar = class TestUserEnvVar {
    before() { }
    testMatchEnvVarPattern() {
        const tests = [
            {
                pattern: "*/*",
                repository: "some/repo",
                result: true,
            },
            {
                pattern: "*/*",
                repository: "some/nested/repo",
                result: false,
            },
            {
                pattern: "*/*",
                repository: "some/nested/deeply/repo",
                result: false,
            },
            {
                pattern: "some/*",
                repository: "some/repo",
                result: true,
            },
            {
                pattern: "some/*",
                repository: "some/nested/repo",
                result: false,
            },
            {
                pattern: "some/*",
                repository: "some/nested/deeply/repo",
                result: false,
            },
            {
                pattern: "some/**",
                repository: "some/repo",
                result: true,
            },
            {
                pattern: "some/**",
                repository: "some/nested/repo",
                result: true,
            },
            {
                pattern: "some/**",
                repository: "some/nested/deeply/repo",
                result: true,
            },
            {
                pattern: "some/nested/*",
                repository: "some/repo",
                result: false,
            },
            {
                pattern: "some/nested/*",
                repository: "some/nested/repo",
                result: true,
            },
            {
                pattern: "some/nested/*",
                repository: "some/nested/deeply/repo",
                result: false,
            },
            {
                pattern: "some/nested/*",
                repository: "another/repo",
                result: false,
            },
            {
                pattern: "some/nested/**",
                repository: "some/nested/repo",
                result: true,
            },
            {
                pattern: "some/nested/**",
                repository: "some/nested/deeply/repo",
                result: true,
            },
            {
                pattern: "some/nested/**",
                repository: "another/repo",
                result: false,
            },
            {
                pattern: "*/repo",
                repository: "some/repo",
                result: true,
            },
            {
                pattern: "*/repo",
                repository: "some/nested/repo",
                result: false,
            },
            {
                pattern: "*/repo",
                repository: "some/nested/deeply/repo",
                result: false,
            },
            {
                pattern: "*/repo",
                repository: "another/repo",
                result: true,
            },
            {
                pattern: "*/*/repo",
                repository: "some/repo",
                result: false,
            },
            {
                pattern: "*/*/repo",
                repository: "some/nested/repo",
                result: true,
            },
            {
                pattern: "*/*/repo",
                repository: "some/nested/deeply/repo",
                result: false,
            },
            {
                pattern: "*/*/repo",
                repository: "another/repo",
                result: false,
            },
        ];
        for (const test of tests) {
            const actual = protocol_1.UserEnvVar.matchEnvVarPattern(test.pattern, test.repository);
            expect(actual, `'${test.repository}' % '${test.pattern}' -> ${test.result}`).to.eq(test.result);
        }
    }
};
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestUserEnvVar.prototype, "testMatchEnvVarPattern", null);
TestUserEnvVar = __decorate([
    mocha_1.suite
], TestUserEnvVar);
module.exports = new TestUserEnvVar();
//# sourceMappingURL=user-env-var.spec.js.map