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
const mocha_1 = require("@testdeck/mocha");
const chai = __importStar(require("chai"));
const _1 = require(".");
const expect = chai.expect;
let TestSSHPublicKeyValue = class TestSSHPublicKeyValue {
    constructor() {
        this.key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDCnrN9UdK1bNGPmZfenTWXLuYYDjlYvZE8S+WOfP08WpR1GETzX5ZvgYOEZGwEE8KUPHC9cge4Hvo/ydIS9aqbZ5MiVGJ8cAIq1Ic89SjlDWU6fl8TwIqOPCi2imAASlEDP4q8vMLK1N6UOW1EVbxyL3uybGd10ysC1t1FxFPveIGNsYE/MOQeuEWS16AplpXYXIfVRSlgAskeBft2w8Ud3B4gNe8ECLA/FXu96UpvZkdtOarA3JZ9Z27GveNJg9Mtmmw0+US0KXiO9x9NyH7G8+mqVDwDY+nNvaFA5gtQxkkl/uY2oz9k/B4Rjlj3jOiUXe5uQs3XUm5m8g9a9fh62DabLpA2fEvtfg+a/VqNe52dNa5YjupwvBd6Inb5uMW/TYjNl6bNHPlXFKw/nwLOVzukpkjxMZUKS6+4BGkpoasj6y2rTU/wkpbdD8J7yjI1p6J9aKkC6KksIWgN7xGmHkv2PCGDqMHTNbnQyowtNKMgA/667vAYJ0qW7HAHBFXJRs6uRi/DI3+c1QV2s4wPCpEHDIYApovQ0fbON4WDPoGMyHd7kPh9xB/bX7Dj0uMXImu1pdTd62fQ/1XXX64+vjAAXS/P9RSCD0RCRt/K3LPKl2m7GPI3y1niaE52XhxZw+ms9ays6NasNVMw/ZC+f02Ti+L5FBEVf8230RVVRQ== notfound@codestack.io";
    }
    testValidate() {
        const key = this.key;
        const [t, k, e] = key.split(" ");
        expect(_1.SSHPublicKeyValue.getData({
            key,
            name: "NiceName",
        })).to.deep.equal({ type: t, key: k, email: e });
    }
    testValidateWithDiffType() {
        const key = this.key;
        const [_, k, e] = key.split(" ");
        expect(_1.SSHPublicKeyValue.getData({
            key: key.replace("ssh-rsa", "sk-ecdsa-sha2-nistp256@openssh.com"),
            name: "NiceName",
        })).to.deep.equal({ type: "sk-ecdsa-sha2-nistp256@openssh.com", key: k, email: e });
    }
    testValidateWithoutEmail() {
        const key = this.key;
        const [t, k, _] = key.split(" ");
        expect(_1.SSHPublicKeyValue.getData({
            key: key.replace(" notfound@codestack.io", ""),
            name: "NiceName",
        })).to.deep.equal({ type: t, key: k, email: undefined });
    }
    testValidateWithoutEmailButEndsWithSpaces() {
        const key = this.key;
        const [t, k, _] = key.split(" ");
        expect(_1.SSHPublicKeyValue.getData({
            key: key.replace("notfound@codestack.io", "  "),
            name: "NiceName",
        })).to.deep.equal({ type: t, key: k, email: undefined });
    }
    testValidateWithError() {
        expect(() => _1.SSHPublicKeyValue.getData({
            key: "Hello World",
            name: "NiceName",
        })).throw("Key is invalid");
        expect(() => _1.SSHPublicKeyValue.getData({
            key: "",
            name: "NiceName",
        })).throw("Key is invalid");
    }
    testGetFingerprint() {
        const key = this.key;
        expect(_1.SSHPublicKeyValue.getFingerprint({
            key,
            name: "NiceName",
        })).to.equal("ykjP/b5aqoa3envmXzWpPMCGgEFMu3QvubfSTNrJCMA=");
    }
    testGetFingerprintWithIncorrectPublicKey() {
        expect(() => _1.SSHPublicKeyValue.getFingerprint({
            key: "Hello World",
            name: "NiceName",
        })).to.throw("Key is invalid");
    }
};
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestSSHPublicKeyValue.prototype, "testValidate", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestSSHPublicKeyValue.prototype, "testValidateWithDiffType", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestSSHPublicKeyValue.prototype, "testValidateWithoutEmail", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestSSHPublicKeyValue.prototype, "testValidateWithoutEmailButEndsWithSpaces", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestSSHPublicKeyValue.prototype, "testValidateWithError", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestSSHPublicKeyValue.prototype, "testGetFingerprint", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestSSHPublicKeyValue.prototype, "testGetFingerprintWithIncorrectPublicKey", null);
TestSSHPublicKeyValue = __decorate([
    mocha_1.suite
], TestSSHPublicKeyValue);
let TestEnvVar = class TestEnvVar {
    testGetCodestackImageAuth_empty() {
        const result = _1.EnvVar.getCodestackImageAuth([]);
        expect(result.size).to.equal(0);
    }
    testGetCodestackImageAuth_noRelevantVar() {
        const envVars = [{ name: "OTHER_VAR", value: "some_value" }];
        const result = _1.EnvVar.getCodestackImageAuth(envVars);
        expect(result.size).to.equal(0);
    }
    testGetCodestackImageAuth_singleEntryNoPort() {
        const envVars = [
            {
                name: _1.EnvVar.CODESTACK_IMAGE_AUTH_ENV_VAR_NAME,
                value: "my-registry.foo.net:Zm9vOmJhcg==",
            },
        ];
        const result = _1.EnvVar.getCodestackImageAuth(envVars);
        expect(result.size).to.equal(1);
        expect(result.get("my-registry.foo.net")).to.equal("Zm9vOmJhcg==");
    }
    testGetCodestackImageAuth_singleEntryWithPort() {
        const envVars = [
            {
                name: _1.EnvVar.CODESTACK_IMAGE_AUTH_ENV_VAR_NAME,
                value: "my-registry.foo.net:5000:Zm9vOmJhcg==",
            },
        ];
        const result = _1.EnvVar.getCodestackImageAuth(envVars);
        expect(result.size).to.equal(1);
        expect(result.get("my-registry.foo.net:5000")).to.equal("Zm9vOmJhcg==");
    }
    testGetCodestackImageAuth_multipleEntries() {
        const envVars = [
            {
                name: _1.EnvVar.CODESTACK_IMAGE_AUTH_ENV_VAR_NAME,
                value: "my-registry.foo.net:Zm9vOmJhcg==,my-registry2.bar.com:YWJjOmRlZg==",
            },
        ];
        const result = _1.EnvVar.getCodestackImageAuth(envVars);
        expect(result.size).to.equal(2);
        expect(result.get("my-registry.foo.net")).to.equal("Zm9vOmJhcg==");
        expect(result.get("my-registry2.bar.com")).to.equal("YWJjOmRlZg==");
    }
    testGetCodestackImageAuth_multipleEntriesWithPortAndMalformed() {
        const envVars = [
            {
                name: _1.EnvVar.CODESTACK_IMAGE_AUTH_ENV_VAR_NAME,
                value: "my-registry.foo.net:5000:Zm9vOmJhcg==,my-registry2.bar.com:YWJjOmRlZg==,invalidEntry,another.host:anothercred",
            },
        ];
        const result = _1.EnvVar.getCodestackImageAuth(envVars);
        expect(result.size).to.equal(3);
        expect(result.get("my-registry2.bar.com")).to.equal("YWJjOmRlZg==");
        expect(result.get("another.host")).to.equal("anothercred");
        expect(result.get("my-registry.foo.net:5000")).to.equal("Zm9vOmJhcg==");
    }
    testGetCodestackImageAuth_emptyValue() {
        const envVars = [
            {
                name: _1.EnvVar.CODESTACK_IMAGE_AUTH_ENV_VAR_NAME,
                value: "",
            },
        ];
        const result = _1.EnvVar.getCodestackImageAuth(envVars);
        expect(result.size).to.equal(0);
    }
    testGetCodestackImageAuth_malformedEntries() {
        const envVars = [
            {
                name: _1.EnvVar.CODESTACK_IMAGE_AUTH_ENV_VAR_NAME,
                value: "justhost,hostonly:,:credonly,:::,:,",
            },
        ];
        const result = _1.EnvVar.getCodestackImageAuth(envVars);
        expect(result.size).to.equal(0);
    }
    testGetCodestackImageAuth_entriesWithSpaces() {
        const envVars = [
            {
                name: _1.EnvVar.CODESTACK_IMAGE_AUTH_ENV_VAR_NAME,
                value: " my-registry.foo.net : Zm9vOmJhcg== ,  my-registry2.bar.com:YWJjOmRlZg==  ",
            },
        ];
        const result = _1.EnvVar.getCodestackImageAuth(envVars);
        expect(result.size).to.equal(2);
        expect(result.get("my-registry.foo.net")).to.equal("Zm9vOmJhcg==");
        expect(result.get("my-registry2.bar.com")).to.equal("YWJjOmRlZg==");
    }
};
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestEnvVar.prototype, "testGetCodestackImageAuth_empty", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestEnvVar.prototype, "testGetCodestackImageAuth_noRelevantVar", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestEnvVar.prototype, "testGetCodestackImageAuth_singleEntryNoPort", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestEnvVar.prototype, "testGetCodestackImageAuth_singleEntryWithPort", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestEnvVar.prototype, "testGetCodestackImageAuth_multipleEntries", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestEnvVar.prototype, "testGetCodestackImageAuth_multipleEntriesWithPortAndMalformed", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestEnvVar.prototype, "testGetCodestackImageAuth_emptyValue", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestEnvVar.prototype, "testGetCodestackImageAuth_malformedEntries", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestEnvVar.prototype, "testGetCodestackImageAuth_entriesWithSpaces", null);
TestEnvVar = __decorate([
    mocha_1.suite
], TestEnvVar);
// Exporting both test suites
const testSSHPublicKeyValue = new TestSSHPublicKeyValue();
const testEnvVar = new TestEnvVar();
module.exports = {
    testSSHPublicKeyValue,
    testEnvVar,
};
//# sourceMappingURL=protocol.spec.js.map