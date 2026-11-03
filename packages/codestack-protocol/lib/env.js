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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractComponentEnv = void 0;
exports.getEnvVar = getEnvVar;
exports.filePathTelepresenceAware = filePathTelepresenceAware;
exports.getEnvVarParsed = getEnvVarParsed;
const inversify_1 = require("inversify");
let AbstractComponentEnv = class AbstractComponentEnv {
};
exports.AbstractComponentEnv = AbstractComponentEnv;
exports.AbstractComponentEnv = AbstractComponentEnv = __decorate([
    (0, inversify_1.injectable)()
], AbstractComponentEnv);
function getEnvVar(name, defaultValue) {
    const value = process.env[name] || defaultValue;
    if (!value) {
        throw new Error(`Environment variable undefined or empty: ${name}`);
    }
    return value;
}
function filePathTelepresenceAware(filePath) {
    if (filePath && process.env.TELEPRESENCE_ROOT) {
        filePath = process.env.TELEPRESENCE_ROOT + filePath;
    }
    return filePath;
}
function getEnvVarParsed(name, parser, defaultValue) {
    return parser(getEnvVar(name, defaultValue));
}
//# sourceMappingURL=env.js.map