"use strict";
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-floating-promises */
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
const chaiSubset = require("chai-subset");
chai.use(chaiSubset);
const __1 = require("..");
const assert_1 = require("assert");
const deferred_1 = require("./deferred");
const expect = chai.expect;
let QueueSpec = class QueueSpec {
    before() {
        this.queue = new __1.Queue();
        this.seq = [];
    }
    async exec(seqNr, nextTick = false, sleep = 0) {
        return this.queue.enqueue(async () => {
            const push = async () => {
                if (sleep > 0)
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            this.seq.push(seqNr);
                            resolve(undefined);
                        }, sleep);
                    });
                else
                    this.seq.push(seqNr);
            };
            if (nextTick)
                return new Promise((resolve) => {
                    process.nextTick(() => {
                        push().then(resolve);
                    });
                });
            else
                await push();
        });
    }
    execError(seqNr) {
        const deferred = new deferred_1.Deferred();
        this.queue
            .enqueue(async () => {
            this.seq.push(seqNr);
            throw new Error("test error");
        })
            .then(() => {
            deferred.reject(false);
        })
            .catch(() => {
            deferred.resolve(true);
        });
        return deferred;
    }
    expectArray(actual, expected) {
        expect(actual).to.have.lengthOf(expected.length);
        const expIt = expected.entries();
        for (const act of actual) {
            const { value: [, exp], } = expIt.next();
            expect(act).to.deep.equal(exp);
        }
    }
    async isExecutedInOrder() {
        this.exec(1);
        await this.exec(2);
        this.expectArray(this.seq, [1, 2]);
    }
    async isExecutedInOrderSkipTick() {
        this.exec(1, true);
        await this.exec(2);
        this.expectArray(this.seq, [1, 2]);
    }
    async isExecutedInOrderSleep() {
        this.exec(1, false, 2000);
        await this.exec(2);
        this.expectArray(this.seq, [1, 2]);
    }
    async continueDespiteError() {
        this.exec(1);
        const receivedError = this.execError(2);
        await this.exec(3);
        expect(receivedError.isResolved).to.equal(true);
        expect(await receivedError.promise).to.equal(true);
        this.expectArray(this.seq, [1, 2, 3]);
    }
    async mustCatchError() {
        const f = async () => {
            throw new Error();
        };
        try {
            const p = this.queue.enqueue(async () => {
                return f();
            });
            p.catch((err) => {
                // Silence unhandled promise rejection messages
            });
        }
        catch (err) {
            (0, assert_1.fail)("We expect to catch no error");
        }
    }
    async expectUncaughtError() {
        const f = async () => {
            throw new Error();
        };
        const p = this.queue.enqueue(async () => {
            return f();
        });
        p.then((r) => {
            (0, assert_1.fail)("Expected to catch error!");
        }).catch((err) => {
            // Silence unhandled promise rejection messages
        });
    }
};
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QueueSpec.prototype, "isExecutedInOrder", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QueueSpec.prototype, "isExecutedInOrderSkipTick", null);
__decorate([
    mocha_1.test,
    (0, mocha_1.timeout)(3000),
    (0, mocha_1.slow)(3000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QueueSpec.prototype, "isExecutedInOrderSleep", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QueueSpec.prototype, "continueDespiteError", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QueueSpec.prototype, "mustCatchError", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QueueSpec.prototype, "expectUncaughtError", null);
QueueSpec = __decorate([
    mocha_1.suite
], QueueSpec);
module.exports = new QueueSpec();
//# sourceMappingURL=queue.spec.js.map