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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalEncryptionService = exports.EncryptionServiceImpl = exports.EncryptionService = void 0;
exports.getGlobalEncryptionService = getGlobalEncryptionService;
const inversify_1 = require("inversify");
const encryption_engine_1 = require("./encryption-engine");
const key_provider_1 = require("./key-provider");
exports.EncryptionService = Symbol("EncryptionService");
let EncryptionServiceImpl = class EncryptionServiceImpl {
    encrypt(data) {
        const dataStr = this.serialize(data);
        const key = this.keyProvider.getPrimaryKey();
        const encryptedData = this.engine.encrypt(dataStr, key.material);
        return {
            ...encryptedData,
            keyMetadata: key.metadata,
        };
    }
    decrypt(encrypted) {
        const key = this.keyProvider.getKeyFor(encrypted.keyMetadata);
        const serializedData = this.engine.decrypt(encrypted, key.material);
        return this.deserialize(serializedData);
    }
    serialize(data) {
        return JSON.stringify(data);
    }
    deserialize(data) {
        return JSON.parse(data);
    }
};
exports.EncryptionServiceImpl = EncryptionServiceImpl;
__decorate([
    (0, inversify_1.inject)(encryption_engine_1.EncryptionEngine),
    __metadata("design:type", Object)
], EncryptionServiceImpl.prototype, "engine", void 0);
__decorate([
    (0, inversify_1.inject)(key_provider_1.KeyProvider),
    __metadata("design:type", Object)
], EncryptionServiceImpl.prototype, "keyProvider", void 0);
exports.EncryptionServiceImpl = EncryptionServiceImpl = __decorate([
    (0, inversify_1.injectable)()
], EncryptionServiceImpl);
/** HACK ahead: Some entities - namely DBTokenEntry for now - need access to an EncryptionService so we publish it here */
var GlobalEncryptionService;
(function (GlobalEncryptionService) {
})(GlobalEncryptionService || (exports.GlobalEncryptionService = GlobalEncryptionService = {}));
function getGlobalEncryptionService() {
    return GlobalEncryptionService.encryptionService;
}
//# sourceMappingURL=encryption-service.js.map