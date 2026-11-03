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
const generate_async_generator_1 = require("./generate-async-generator");
const expect = chai.expect;
function watchWith(times, listener) {
    let i = 0;
    const cancel = setInterval(() => {
        if (i < times) {
            listener(i++);
        }
    }, 100);
    return {
        dispose: () => {
            clearInterval(cancel);
        },
    };
}
const error = new Error("Test error");
function watchIterator(ref, opts) {
    var _a;
    const abortController = new AbortController();
    setTimeout(() => {
        abortController.abort();
    }, (_a = opts.abortAfterMs) !== null && _a !== void 0 ? _a : 600);
    return (0, generate_async_generator_1.generateAsyncGenerator)((sink) => {
        try {
            if (opts.setupError) {
                throw error;
            }
            ref.watchStarted = true;
            const dispose = watchWith(opts.times, (v) => {
                if (opts.errorAfter && opts.errorAfter === v) {
                    sink.fail(error);
                    return;
                }
                sink.push(v);
            });
            return () => {
                ref.isDisposed = true;
                dispose.dispose();
            };
        }
        catch (e) {
            sink.fail(e);
        }
    }, { signal: abortController.signal });
}
let TestGenerateAsyncGenerator = class TestGenerateAsyncGenerator {
    async "happy path"() {
        const ref = { isDisposed: false, result: [], watchStarted: false };
        const it = watchIterator(ref, { times: 5 });
        try {
            for await (const v of it) {
                ref.result.push(v);
            }
            expect.fail("should throw error");
        }
        catch (e) {
            if (ref.watchStarted) {
                expect(ref.isDisposed).to.be.equal(true);
            }
            expect(e.message).to.be.equal("cancelled");
            expect(ref.result.length).to.be.equal(5);
            ref.result.forEach((v, i) => expect(v).to.be.equal(i));
            expect(ref.isDisposed).to.be.equal(true);
        }
    }
    async "should be stopped after abort signal is triggered"() {
        const ref = { isDisposed: false, result: [], watchStarted: false };
        const it = watchIterator(ref, { times: 5, abortAfterMs: 120 });
        try {
            for await (const v of it) {
                ref.result.push(v);
            }
            expect.fail("should throw error");
        }
        catch (e) {
            if (ref.watchStarted) {
                expect(ref.isDisposed).to.be.equal(true);
            }
            expect(e.message).to.be.equal("cancelled");
            expect(ref.result[0]).to.be.equal(0);
            expect(ref.result.length).to.be.equal(1);
            ref.result.forEach((v, i) => expect(v).to.be.equal(i));
            expect(ref.isDisposed).to.be.equal(true);
        }
    }
    async "should throw error if setup throws"() {
        const ref = { isDisposed: false, result: [], watchStarted: false };
        const it = watchIterator(ref, { times: 5, setupError: true });
        try {
            for await (const v of it) {
                ref.result.push(v);
            }
            expect.fail("should throw error");
        }
        catch (e) {
            if (ref.watchStarted) {
                expect(ref.isDisposed).to.be.equal(true);
            }
            expect(e).to.be.equal(error);
            expect(ref.result.length).to.be.equal(0);
            ref.result.forEach((v, i) => expect(v).to.be.equal(i));
            expect(ref.isDisposed).to.be.equal(false);
        }
    }
    async "should propagate errors from sink.next"() {
        const ref = { isDisposed: false, result: [], watchStarted: false };
        const it = watchIterator(ref, { times: 5, errorAfter: 2 });
        try {
            for await (const v of it) {
                ref.result.push(v);
            }
            expect.fail("should throw error");
        }
        catch (e) {
            if (ref.watchStarted) {
                expect(ref.isDisposed).to.be.equal(true);
            }
            expect(e).to.be.equal(error);
            expect(ref.result.length).to.be.equal(2);
            ref.result.forEach((v, i) => expect(v).to.be.equal(i));
            expect(ref.isDisposed).to.be.equal(true);
        }
    }
    async "should not start iterator if pre throw error in an iterator"() {
        const ref = { isDisposed: false, result: [], watchStarted: false };
        const it = this.mockWatchWorkspaceStatus(ref, { times: 5, errorAfter: 2 });
        try {
            for await (const v of it) {
                ref.result.push(v);
            }
            expect.fail("should throw error");
        }
        catch (e) {
            expect(ref.watchStarted).to.be.equal(false);
            if (ref.watchStarted) {
                expect(ref.isDisposed).to.be.equal(true);
            }
            expect(e.message).to.be.equal("Should throw error");
            expect(ref.result.length).to.be.equal(0);
            ref.result.forEach((v, i) => expect(v).to.be.equal(i));
            expect(ref.isDisposed).to.be.equal(false);
        }
    }
    async *mockWatchWorkspaceStatus(ref, option) {
        const shouldThrow = true;
        if (shouldThrow) {
            throw new Error("Should throw error");
        }
        const it = watchIterator(ref, option);
        for await (const item of it) {
            yield item;
        }
    }
};
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestGenerateAsyncGenerator.prototype, "happy path", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestGenerateAsyncGenerator.prototype, "should be stopped after abort signal is triggered", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestGenerateAsyncGenerator.prototype, "should throw error if setup throws", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestGenerateAsyncGenerator.prototype, "should propagate errors from sink.next", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestGenerateAsyncGenerator.prototype, "should not start iterator if pre throw error in an iterator", null);
TestGenerateAsyncGenerator = __decorate([
    mocha_1.suite
], TestGenerateAsyncGenerator);
module.exports = new TestGenerateAsyncGenerator(); // Only to circumvent no usage warning :-/
//# sourceMappingURL=generate-async-generator.spec.js.map