"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptionEngineImpl = exports.EncryptionEngine = void 0;
/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
require("reflect-metadata");
const crypto = __importStar(require("crypto"));
const inversify_1 = require("inversify");
exports.EncryptionEngine = Symbol("EncryptionEngine");
/**
 * For starters, let's use aes-cbc-256 with:
 * - 16 bytes/128 bits IV (the size of an aes-256-cbc block)
 * - no salt, as we pass in a real key (no salting needed to turn a password into a key)
 * The implementation closely follows the exampes in https://nodejs.org/api/crypto.html.
 */
let EncryptionEngineImpl = class EncryptionEngineImpl {
    constructor() {
        this.algorithm = "aes-256-cbc";
        this.enc = "base64";
    }
    encrypt(data, key) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.algorithm, key, iv);
        const encrypted = cipher.update(Buffer.from(data, "utf8"));
        const finalEncrypted = Buffer.concat([encrypted, cipher.final()]);
        return {
            data: finalEncrypted.toString(this.enc),
            keyParams: {
                iv: iv.toString(this.enc),
            },
        };
    }
    decrypt(encryptedData, key) {
        const decipher = crypto.createDecipheriv(this.algorithm, key, Buffer.from(encryptedData.keyParams.iv, this.enc));
        const decrypted = decipher.update(Buffer.from(encryptedData.data, this.enc));
        const finalDecrypted = Buffer.concat([decrypted, decipher.final()]);
        return finalDecrypted.toString("utf8");
    }
};
exports.EncryptionEngineImpl = EncryptionEngineImpl;
exports.EncryptionEngineImpl = EncryptionEngineImpl = __decorate([
    (0, inversify_1.injectable)()
], EncryptionEngineImpl);
//# sourceMappingURL=encryption-engine.js.map