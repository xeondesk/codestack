"use strict";
/**
 * Copyright (c) 2021 Codestack GmbH. All rights reserved.
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
const tracing_1 = require("./tracing");
const opentracing_1 = require("opentracing");
const expect = chai.expect;
let TestTracing = class TestTracing {
    async testTracingContext_addNestedTags() {
        const tracer = new opentracing_1.MockTracer();
        const span = tracer.startSpan("testTracingContext_addNestedTags");
        tracing_1.TraceContext.addNestedTags({ span }, {
            rpc: {
                system: "jsonrpc",
                jsonrpc: {
                    version: "1.0",
                    method: "test",
                    parameters: ["abc", "def"],
                },
            },
        });
        const mockSpan = tracer.report().spans[0];
        expect(mockSpan.tags()).to.deep.equal({
            "rpc.system": "jsonrpc",
            "rpc.jsonrpc.version": "1.0",
            "rpc.jsonrpc.method": "test",
            "rpc.jsonrpc.parameters.0": "abc",
            "rpc.jsonrpc.parameters.1": "def",
        });
    }
    async testTracingContext_addNestedTags_null() {
        const tracer = new opentracing_1.MockTracer();
        const span = tracer.startSpan("testTracingContext_addNestedTags_null");
        tracing_1.TraceContext.addNestedTags({ span }, {
            someShape: {
                thisIsNull: null,
                thisIsUndefined: undefined,
            },
        });
        const mockSpan = tracer.report().spans[0];
        expect(mockSpan.tags()).to.deep.equal({
            "someShape.thisIsNull": null,
            "someShape.thisIsUndefined": undefined,
        });
    }
    async testTracingContext_addJsonRPCParameters() {
        const tracer = new opentracing_1.MockTracer();
        const span = tracer.startSpan("testTracingContext_addJsonRPCParameters");
        const ctx = { span };
        tracing_1.TraceContext.addJsonRPCParameters(ctx, {
            one: "one",
            two: {
                name: "two",
                some: "shape",
                containing: "PII",
            },
            three: "three",
        });
        const mockSpan = tracer.report().spans[0];
        expect(mockSpan.tags()).to.deep.equal({
            "rpc.jsonrpc.parameters.one": "one",
            "rpc.jsonrpc.parameters.two.containing": "PII",
            "rpc.jsonrpc.parameters.two.name": "two",
            "rpc.jsonrpc.parameters.two.some": "shape",
            "rpc.jsonrpc.parameters.three": "three",
            "rpc.system": "jsonrpc",
        });
    }
};
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestTracing.prototype, "testTracingContext_addNestedTags", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestTracing.prototype, "testTracingContext_addNestedTags_null", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestTracing.prototype, "testTracingContext_addJsonRPCParameters", null);
TestTracing = __decorate([
    mocha_1.suite
], TestTracing);
module.exports = new TestTracing();
//# sourceMappingURL=tracing.spec.js.map