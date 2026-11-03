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
const codestack_file_parser_1 = require("./codestack-file-parser");
const expect = chai.expect;
const DEFAULT_IMAGE = "default-image";
const DEFAULT_CONFIG = { image: DEFAULT_IMAGE };
let TestCodestackFileParser = class TestCodestackFileParser {
    before() {
        this.parser = new codestack_file_parser_1.CodestackFileParser();
    }
    testOnlyOnePort() {
        const content = `ports:\n` + `  - port: 5555`;
        const result = this.parser.parse(content, {}, DEFAULT_CONFIG);
        expect(result.config).to.deep.equal({
            ports: [
                {
                    port: 5555,
                },
            ],
            image: DEFAULT_IMAGE,
        });
    }
    testPortRange() {
        const content = `ports:\n` + `  - port: 5555\n` + `  - port: 3000-3999`; // should be filtered out by default
        const result = this.parser.parse(content, {}, DEFAULT_CONFIG);
        expect(result.config).to.deep.equal({
            ports: [
                {
                    port: 5555,
                },
            ],
            image: DEFAULT_IMAGE,
        });
    }
    testPortRangeAccepted() {
        const content = `ports:\n` + `  - port: 5555\n` + `  - port: 3000-3999`; // should be included if explicitly supported
        const result = this.parser.parse(content, { acceptPortRanges: true }, DEFAULT_CONFIG);
        expect(result.config).to.deep.equal({
            ports: [
                {
                    port: 5555,
                },
                {
                    port: "3000-3999",
                },
            ],
            image: DEFAULT_IMAGE,
        });
    }
    testSimpleTask() {
        const content = `tasks:\n` + `  - command: yarn`;
        const result = this.parser.parse(content, {}, DEFAULT_CONFIG);
        expect(result.config).to.deep.equal({
            tasks: [
                {
                    command: "yarn",
                },
            ],
            image: DEFAULT_IMAGE,
        });
    }
    testSimpleImage() {
        const imageName = "my-test-org/my-test-image:some-tag";
        const content = `image: "${imageName}"\n`;
        const result = this.parser.parse(content);
        expect(result.config).to.deep.equal({
            image: imageName,
        });
    }
    testComplexImageWithoutContext() {
        const dockerFileName = "Dockerfile";
        const content = `image:\n  file: ${dockerFileName}\n`;
        const result = this.parser.parse(content);
        expect(result.config).to.deep.equal({
            image: {
                file: dockerFileName,
            },
        });
    }
    testComplexImageWithContext() {
        const dockerFileName = "Dockerfile";
        const dockerContext = "docker";
        const content = `image:\n  file: ${dockerFileName}\n  context: ${dockerContext}\n`;
        const result = this.parser.parse(content);
        expect(result.config).to.deep.equal({
            image: {
                file: dockerFileName,
                context: dockerContext,
            },
        });
    }
    testGitconfig() {
        const content = `
gitConfig:
    core.autocrlf: input
`;
        const result = this.parser.parse(content, {}, DEFAULT_CONFIG);
        expect(result.config).to.deep.equal({
            gitConfig: {
                "core.autocrlf": "input",
            },
            image: DEFAULT_IMAGE,
        });
    }
    testBrokenConfig() {
        const content = `image: 42\n`;
        const result = this.parser.parse(content, {}, DEFAULT_CONFIG);
        expect(result.config).to.deep.equal({
            image: DEFAULT_IMAGE,
        });
    }
};
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestCodestackFileParser.prototype, "testOnlyOnePort", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestCodestackFileParser.prototype, "testPortRange", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestCodestackFileParser.prototype, "testPortRangeAccepted", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestCodestackFileParser.prototype, "testSimpleTask", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestCodestackFileParser.prototype, "testSimpleImage", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestCodestackFileParser.prototype, "testComplexImageWithoutContext", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestCodestackFileParser.prototype, "testComplexImageWithContext", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestCodestackFileParser.prototype, "testGitconfig", null);
__decorate([
    mocha_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestCodestackFileParser.prototype, "testBrokenConfig", null);
TestCodestackFileParser = __decorate([
    mocha_1.suite
], TestCodestackFileParser);
module.exports = new TestCodestackFileParser(); // Only to circumvent no usage warning :-/
//# sourceMappingURL=codestack-file-parser.spec.js.map