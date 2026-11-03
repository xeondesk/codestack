"use strict";
/**
 * Copyright (c) 2021 Codestack GmbH. All rights reserved.
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugApp = exports.SetLogLevelRequest = void 0;
const express_1 = __importDefault(require("express"));
const inversify_1 = require("inversify");
const logging_1 = require("./logging");
var SetLogLevelRequest;
(function (SetLogLevelRequest) {
    function is(o) {
        return typeof o === "object" && "level" in o;
    }
    SetLogLevelRequest.is = is;
})(SetLogLevelRequest || (exports.SetLogLevelRequest = SetLogLevelRequest = {}));
let DebugApp = class DebugApp {
    constructor() {
        this.httpServer = undefined;
    }
    ctor() {
        this._app = this.create();
    }
    create() {
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
        app.post("/debug/logging", (req, res) => {
            try {
                const levelRequest = req.body;
                if (!SetLogLevelRequest.is(levelRequest)) {
                    res.status(400).end("not a SetLogLevelRequest");
                    return;
                }
                const newLogLevel = levelRequest.level;
                logging_1.log.setLogLevel(newLogLevel);
                logging_1.log.info("set log level", { newLogLevel });
                res.status(200).end(JSON.stringify(levelRequest));
            }
            catch (err) {
                res.status(500).end(err);
            }
        });
        return app;
    }
    start(port = 6060) {
        this.httpServer = this._app.listen(port, "localhost", () => {
            logging_1.log.info(`debug server listening on port: ${port}`);
        });
    }
    async stop() {
        const server = this.httpServer;
        if (!server) {
            return;
        }
        return new Promise((resolve) => server.close((err) => {
            if (err) {
                logging_1.log.warn(`error while closing http server`, { err });
            }
            this.httpServer = undefined;
            resolve();
        }));
    }
    get app() {
        return this._app;
    }
};
exports.DebugApp = DebugApp;
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugApp.prototype, "ctor", null);
exports.DebugApp = DebugApp = __decorate([
    (0, inversify_1.injectable)()
], DebugApp);
//# sourceMappingURL=debug-app.js.map