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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodestackFileParser = void 0;
const inversify_1 = require("inversify");
const yaml = __importStar(require("js-yaml"));
const ajv_1 = __importDefault(require("ajv"));
const logging_1 = require("./util/logging");
const protocol_1 = require("./protocol");
const schema = require("../data/codestack-schema.json");
const validate = new ajv_1.default().compile(schema);
const defaultParseOptions = {
    acceptPortRanges: false,
};
let CodestackFileParser = class CodestackFileParser {
    parse(content, parseOptions = {}, defaultConfig = {}) {
        const options = {
            ...defaultParseOptions,
            ...parseOptions,
        };
        try {
            const parsedConfig = yaml.safeLoad(content);
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            validate(parsedConfig);
            const validationErrors = validate.errors ? validate.errors.map((e) => e.message || e.keyword) : undefined;
            if (validationErrors && validationErrors.length > 0) {
                return {
                    config: defaultConfig,
                    parsedConfig,
                    validationErrors,
                };
            }
            const overrides = {};
            if (!options.acceptPortRanges && Array.isArray(parsedConfig.ports)) {
                overrides.ports = parsedConfig.ports.filter((port) => !protocol_1.PortRangeConfig.is(port));
            }
            return {
                config: {
                    ...defaultConfig,
                    ...parsedConfig,
                    ...overrides,
                },
                parsedConfig,
            };
        }
        catch (err) {
            logging_1.log.error("Unparsable Codestack configuration", err, { content });
            return {
                config: defaultConfig,
                validationErrors: ["Unparsable Codestack configuration: " + err.toString()],
            };
        }
    }
};
exports.CodestackFileParser = CodestackFileParser;
exports.CodestackFileParser = CodestackFileParser = __decorate([
    (0, inversify_1.injectable)()
], CodestackFileParser);
//# sourceMappingURL=codestack-file-parser.js.map