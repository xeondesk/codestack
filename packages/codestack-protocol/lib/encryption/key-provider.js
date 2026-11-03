"use strict";
/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyProviderImpl = exports.KeyProviderConfig = exports.KeyProvider = void 0;
const inversify_1 = require("inversify");
exports.KeyProvider = Symbol("KeyProvider");
exports.KeyProviderConfig = Symbol("KeyProviderConfig");
let KeyProviderImpl = class KeyProviderImpl {
    static loadKeyConfigFromJsonString(configStr) {
        const keys = (JSON.parse(configStr) || []);
        if (!Array.isArray(keys) || keys.length < 0 || 1 !== keys.reduce((p, k) => (k.primary ? p + 1 : p), 0)) {
            throw new Error("Invalid key config!");
        }
        return keys;
    }
    constructor(config) {
        this.config = config;
    }
    get keys() {
        return this.config.keys;
    }
    getPrimaryKey() {
        const primaryKey = this.keys.find((key) => !!key.primary);
        if (!primaryKey) {
            throw new Error("No primary encryption key found!");
        }
        return this.configToKey(primaryKey);
    }
    getKeyFor(metadata) {
        const key = this.keys.find((k) => k.name === metadata.name && k.version === metadata.version);
        if (!key) {
            throw new Error(`No key found for metadata ${metadata.name}/${metadata.version}`);
        }
        return this.configToKey(key);
    }
    configToKey(config) {
        return {
            metadata: {
                name: config.name,
                version: config.version,
            },
            material: Buffer.from(config.material, "base64"),
        };
    }
};
exports.KeyProviderImpl = KeyProviderImpl;
exports.KeyProviderImpl = KeyProviderImpl = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(exports.KeyProviderConfig)),
    __metadata("design:paramtypes", [Object])
], KeyProviderImpl);
//# sourceMappingURL=key-provider.js.map