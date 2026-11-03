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
exports.t = void 0;
const mocha_1 = require("@testdeck/mocha");
const chai = __importStar(require("chai"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const encryption_engine_1 = require("./encryption-engine");
const expect = chai.expect;
let TestEncryptionEngineImpl = class TestEncryptionEngineImpl {
    // Created with openssl rand -rand /dev/urandom -out key -base64 32
    get testkey() {
        const keyFilePath = path.resolve(__dirname, "../../test/fixtures/encryption/testkey");
        const keyBuffer = fs.readFileSync(keyFilePath);
        return keyBuffer.toString().trim();
    }
    basicSymmetry() {
        const plaintext = "12345678901234567890";
        const key = Buffer.from(this.testkey, "base64");
        const cut = new encryption_engine_1.EncryptionEngineImpl();
        const encryptedData = cut.encrypt(plaintext, key);
        expect(encryptedData).to.be.not.undefined;
        const decryptedPlaintext = cut.decrypt(encryptedData, key);
        expect(decryptedPlaintext).equals(plaintext);
    }
};
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestEncryptionEngineImpl.prototype, "basicSymmetry", null);
TestEncryptionEngineImpl = __decorate([
    mocha_1.suite
], TestEncryptionEngineImpl);
exports.t = new TestEncryptionEngineImpl();
//# sourceMappingURL=encryption-engine.spec.js.map