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
exports.TimeutilSpec = void 0;
const chai = __importStar(require("chai"));
const expect = chai.expect;
const mocha_1 = require("@testdeck/mocha");
const timeutil_1 = require("./timeutil");
let TimeutilSpec = class TimeutilSpec {
    testDaysBefore() {
        const now = new Date().toISOString();
        expect((0, timeutil_1.daysBefore)(now, 2)).to.be.eq((0, timeutil_1.hoursBefore)(now, 48));
    }
    testTimeutil() {
        // targeting a 1st, 1th of Jan => 1st of Feb
        this.isOneMonthLater(new Date(2000, 0, 1), 1, new Date(2000, 1, 1));
        // targeting a 31th, 30th of Apr => 31st of May
        this.isOneMonthLater(new Date(2000, 3, 30), 31, new Date(2000, 4, 31));
        // targeting a 31th, 31th of Mar => 30th of Apr
        this.isOneMonthLater(new Date(2000, 2, 31), 31, new Date(2000, 3, 30));
        // targeting a 30th, 30th of Mar => 30th of Apr
        this.isOneMonthLater(new Date(2000, 2, 30), 30, new Date(2000, 3, 30));
        // next year
        this.isOneMonthLater(new Date(2000, 11, 1), 1, new Date(2001, 0, 1));
        this.isOneMonthLater(new Date(2000, 11, 31), 31, new Date(2001, 0, 31));
        // Feb
        this.isOneMonthLater(new Date(2001, 0, 31), 31, new Date(2001, 1, 28));
        // Feb leap year
        this.isOneMonthLater(new Date(2000, 0, 31), 31, new Date(2000, 1, 29));
    }
    isOneMonthLater(from, day, expectation) {
        const later = (0, timeutil_1.oneMonthLater)(from.toISOString(), day);
        expect(later, `expected ${later} to be equal ${expectation}`).to.be.equal(expectation.toISOString());
    }
    testDaysBefore2() {
        const tests = [
            {
                date: new Date("2021-07-13T00:00:00.000Z"),
                daysEarlier: 365,
                expectation: "2020-07-13T00:00:00.000Z",
            },
            {
                date: new Date("2019-02-01T00:00:00.000Z"),
                daysEarlier: 365,
                expectation: "2018-02-01T00:00:00.000Z",
            },
        ];
        for (const t of tests) {
            const actual = (0, timeutil_1.daysBefore)(t.date.toISOString(), t.daysEarlier);
            expect(actual).to.equal(t.expectation, `expected ${actual} to be equal ${t.expectation}`);
        }
    }
    testParseGoDurationToMs() {
        const scenarios = [
            { input: "1ms", out: 1 },
            { input: "1m", out: 1 * 60 * 1000 },
            { input: "1m0s", out: 1 * 60 * 1000 },
            { input: "1m30s", out: 1 * 60 * 1000 + 30 * 1000 },
            { input: "1h1m30s", out: 1 * 60 * 60 * 1000 + 1 * 60 * 1000 + 30 * 1000 },
        ];
        for (const t of scenarios) {
            const actual = (0, timeutil_1.parseGoDurationToMs)(t.input);
            expect(actual).to.equal(t.out, `expected ${t.input} to be ${t.out} in MS`);
        }
    }
    testGoDurationToHumanReadable() {
        const scenarios = [
            { input: "1m", out: "1 minute" },
            { input: "2m", out: "2 minutes" },
            { input: "1m0s", out: "1 minute" },
            { input: "2m0s", out: "2 minutes" },
            { input: "1m30s", out: "1 minute 30 seconds" },
            { input: "2m30s", out: "2 minutes 30 seconds" },
            { input: "1h1m30s", out: "1 hour 1 minute 30 seconds" },
        ];
        for (const t of scenarios) {
            const actual = (0, timeutil_1.goDurationToHumanReadable)(t.input);
            expect(actual).to.equal(t.out, `expected ${t.input} to be ${t.out} in human readable form`);
        }
    }
};
exports.TimeutilSpec = TimeutilSpec;
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TimeutilSpec.prototype, "testDaysBefore", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TimeutilSpec.prototype, "testTimeutil", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TimeutilSpec.prototype, "testDaysBefore2", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TimeutilSpec.prototype, "testParseGoDurationToMs", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TimeutilSpec.prototype, "testGoDurationToHumanReadable", null);
exports.TimeutilSpec = TimeutilSpec = __decorate([
    (0, mocha_1.suite)()
], TimeutilSpec);
//# sourceMappingURL=timeutil.spec.js.map