"use strict";
/**
 * Copyright (c) 2022 Codestack GmbH. All rights reserved.
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
exports.Experiments = void 0;
exports.getExperimentsClientForBackend = getExperimentsClientForBackend;
const configcat = __importStar(require("configcat-node"));
const configcat_common_1 = require("configcat-common");
const configcat_1 = require("./configcat");
const always_default_1 = require("./always-default");
let client;
var Experiments;
(function (Experiments) {
    function configureTestingClient(config) {
        client = {
            getValueAsync(experimentName, defaultValue, attributes) {
                if (config.hasOwnProperty(experimentName)) {
                    return Promise.resolve(config[experimentName]);
                }
                return Promise.resolve(defaultValue);
            },
            dispose() {
                // there is nothing to dispose, no-op.
            },
        };
    }
    Experiments.configureTestingClient = configureTestingClient;
})(Experiments || (exports.Experiments = Experiments = {}));
function getExperimentsClientForBackend() {
    // We have already instantiated a client, we can just re-use it.
    if (client !== undefined) {
        return client;
    }
    // Retrieve SDK key from ENV Variable
    const sdkKey = process.env.CONFIGCAT_SDK_KEY;
    // Self-hosted installations do not set the ConfigCat SDK key, so always use a client which returns the default value.
    if (sdkKey === undefined || sdkKey === "") {
        client = (0, always_default_1.newAlwaysReturningDefaultValueClient)();
        return client;
    }
    const configCatClient = configcat.createClient(sdkKey, {
        pollIntervalSeconds: 3 * 60, // 3 minutes
        requestTimeoutMs: 2000,
        logger: configcat.createConsoleLogger(configcat_common_1.LogLevel.Error),
        maxInitWaitTimeSeconds: 0,
        baseUrl: process.env.CONFIGCAT_BASE_URL,
    });
    client = new configcat_1.ConfigCatClient(configCatClient, process.env.HOST_URL);
    return client;
}
//# sourceMappingURL=configcat-server.js.map