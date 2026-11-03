"use strict";
/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodestackServiceImpl = exports.WorkspaceInstanceUpdateListener = exports.CodestackCompositeClient = exports.CodestackServerProxy = exports.CodestackServerPath = exports.createServerMock = exports.createServiceMock = exports.MAX_PARALLEL_WORKSPACES_PAID = exports.MAX_PARALLEL_WORKSPACES_FREE = exports.WORKSPACE_LIFETIME_LONG = exports.WORKSPACE_LIFETIME_SHORT = exports.WORKSPACE_TIMEOUT_EXTENDED = exports.WORKSPACE_TIMEOUT_DEFAULT_LONG = exports.WORKSPACE_TIMEOUT_DEFAULT_SHORT = exports.WorkspaceTimeoutDuration = exports.CodestackServer = void 0;
const parse_duration_1 = __importDefault(require("parse-duration"));
const vscode_jsonrpc_1 = require("vscode-jsonrpc");
const event_1 = require("./util/event");
exports.CodestackServer = Symbol("CodestackServer");
const WORKSPACE_MAXIMUM_TIMEOUT_HOURS = 24;
var WorkspaceTimeoutDuration;
(function (WorkspaceTimeoutDuration) {
    function validate(duration) {
        duration = duration.trim().toLowerCase();
        try {
            // Keep this strict: ws-manager validates with Go's time.ParseDuration, so aliases like
            // "hr" or "hrs" must not be accepted here.
            if (!/^(?:\d+(?:ns|us|µs|ms|s|m|h))+$/.test(duration)) {
                throw new Error("Invalid duration format");
            }
            const milliseconds = (0, parse_duration_1.default)(duration);
            if (milliseconds === undefined || milliseconds === null) {
                throw new Error("Invalid duration format");
            }
            // Validate the parsed duration is within limits
            const maxMs = WORKSPACE_MAXIMUM_TIMEOUT_HOURS * 60 * 60 * 1000;
            if (milliseconds > maxMs) {
                throw new Error("Workspace inactivity timeout cannot exceed 24h");
            }
            if (milliseconds <= 0) {
                throw new Error(`Invalid timeout value: ${duration}. Timeout must be greater than 0`);
            }
            // Return the original duration string - Go's time.ParseDuration will handle it correctly
            return duration;
        }
        catch (error) {
            // If it's our validation error, re-throw it
            if (error.message.includes("cannot exceed 24h") || error.message.includes("must be greater than 0")) {
                throw error;
            }
            // Otherwise, it's a parsing error from the library
            throw new Error(`Invalid timeout format: ${duration}. Use Go duration format (e.g., "30m", "1h30m", "2h")`);
        }
    }
    WorkspaceTimeoutDuration.validate = validate;
})(WorkspaceTimeoutDuration || (exports.WorkspaceTimeoutDuration = WorkspaceTimeoutDuration = {}));
exports.WORKSPACE_TIMEOUT_DEFAULT_SHORT = "30m";
exports.WORKSPACE_TIMEOUT_DEFAULT_LONG = "60m";
exports.WORKSPACE_TIMEOUT_EXTENDED = "180m";
exports.WORKSPACE_LIFETIME_SHORT = "8h";
exports.WORKSPACE_LIFETIME_LONG = "36h";
exports.MAX_PARALLEL_WORKSPACES_FREE = 4;
exports.MAX_PARALLEL_WORKSPACES_PAID = 16;
const createServiceMock = function (methods) {
    return new CodestackServiceImpl((0, exports.createServerMock)(methods));
};
exports.createServiceMock = createServiceMock;
const createServerMock = function (methods) {
    methods.setClient = methods.setClient || (() => { });
    methods.dispose = methods.dispose || (() => { });
    return new Proxy(methods, {
        // @ts-ignore
        get: (target, property) => {
            const result = target[property];
            if (!result) {
                throw new Error(`Method ${String(property)} not implemented`);
            }
            return result;
        },
    });
};
exports.createServerMock = createServerMock;
exports.CodestackServerPath = "/codestack";
exports.CodestackServerProxy = Symbol("CodestackServerProxy");
class CodestackCompositeClient {
    constructor() {
        this.clients = [];
    }
    registerClient(client) {
        this.clients.push(client);
        return {
            dispose: () => {
                const index = this.clients.indexOf(client);
                if (index > -1) {
                    this.clients.splice(index, 1);
                }
            },
        };
    }
    onInstanceUpdate(instance) {
        for (const client of this.clients) {
            if (client.onInstanceUpdate) {
                try {
                    client.onInstanceUpdate(instance);
                }
                catch (error) {
                    console.error(error);
                }
            }
        }
    }
    onPrebuildUpdate(update) {
        for (const client of this.clients) {
            if (client.onPrebuildUpdate) {
                try {
                    client.onPrebuildUpdate(update);
                }
                catch (error) {
                    console.error(error);
                }
            }
        }
    }
    onWorkspaceImageBuildLogs(info, content) {
        for (const client of this.clients) {
            if (client.onWorkspaceImageBuildLogs) {
                try {
                    client.onWorkspaceImageBuildLogs(info, content);
                }
                catch (error) {
                    console.error(error);
                }
            }
        }
    }
    notifyDidOpenConnection() {
        for (const client of this.clients) {
            if (client.notifyDidOpenConnection) {
                try {
                    client.notifyDidOpenConnection();
                }
                catch (error) {
                    console.error(error);
                }
            }
        }
    }
    notifyDidCloseConnection() {
        for (const client of this.clients) {
            if (client.notifyDidCloseConnection) {
                try {
                    client.notifyDidCloseConnection();
                }
                catch (error) {
                    console.error(error);
                }
            }
        }
    }
}
exports.CodestackCompositeClient = CodestackCompositeClient;
const hasWindow = typeof window !== "undefined";
const phasesOrder = {
    unknown: 0,
    preparing: 1,
    building: 2,
    pending: 3,
    creating: 4,
    initializing: 5,
    running: 6,
    interrupted: 7,
    stopping: 8,
    stopped: 9,
};
class WorkspaceInstanceUpdateListener {
    get info() {
        return this._info;
    }
    constructor(service, _info) {
        this.service = service;
        this._info = _info;
        this.onDidChangeEmitter = new event_1.Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
        this.source = "sync";
        this.syncQueue = Promise.resolve();
        service.registerClient({
            onInstanceUpdate: (instance) => {
                if (this.isOutOfOrder(instance)) {
                    return;
                }
                this.cancelSync();
                this._info.latestInstance = instance;
                this.source = "update";
                this.onDidChangeEmitter.fire(undefined);
            },
            notifyDidOpenConnection: () => {
                this.sync();
            },
        });
        if (hasWindow) {
            // learn about page lifecycle here: https://developers.google.com/web/updates/2018/07/page-lifecycle-api
            window.document.addEventListener("visibilitychange", async () => {
                if (window.document.visibilityState === "visible") {
                    this.sync();
                }
            });
            window.addEventListener("pageshow", (e) => {
                if (e.persisted) {
                    this.sync();
                }
            });
        }
    }
    /**
     * Only one sync can be performed at the same time.
     * Any new sync request or instance update cancels all previously scheduled sync requests.
     */
    sync() {
        this.cancelSync();
        this.syncTokenSource = new vscode_jsonrpc_1.CancellationTokenSource();
        const token = this.syncTokenSource.token;
        this.syncQueue = this.syncQueue.then(async () => {
            if (token.isCancellationRequested) {
                return;
            }
            try {
                const info = await this.service.server.getWorkspace(this._info.workspace.id);
                if (token.isCancellationRequested) {
                    return;
                }
                this._info = info;
                this.source = "sync";
                this.onDidChangeEmitter.fire(undefined);
            }
            catch (e) {
                console.error("failed to sync workspace instance:", e);
            }
        });
    }
    cancelSync() {
        if (this.syncTokenSource) {
            this.syncTokenSource.cancel();
            this.syncTokenSource = undefined;
        }
    }
    /**
     * If sync seen more recent update then ignore all updates with previous phases.
     * Within the same phase still the race can occur but which should be eventually consistent.
     */
    isOutOfOrder(instance) {
        var _a;
        if (instance.workspaceId !== this._info.workspace.id) {
            return true;
        }
        if (this.source === "update") {
            return false;
        }
        if (instance.id !== ((_a = this.info.latestInstance) === null || _a === void 0 ? void 0 : _a.id)) {
            return false;
        }
        return phasesOrder[instance.status.phase] < phasesOrder[this.info.latestInstance.status.phase];
    }
}
exports.WorkspaceInstanceUpdateListener = WorkspaceInstanceUpdateListener;
class CodestackServiceImpl {
    constructor(server, options) {
        this.server = server;
        this.options = options;
        this.compositeClient = new CodestackCompositeClient();
        this.instanceListeners = new Map();
        server.setClient(this.compositeClient);
        server.onDidOpenConnection(() => this.compositeClient.notifyDidOpenConnection());
        server.onDidCloseConnection(() => this.compositeClient.notifyDidCloseConnection());
    }
    registerClient(client) {
        return this.compositeClient.registerClient(client);
    }
    listenToInstance(workspaceId) {
        const listener = this.instanceListeners.get(workspaceId) ||
            (async () => {
                const info = await this.server.getWorkspace(workspaceId);
                return new WorkspaceInstanceUpdateListener(this, info);
            })();
        this.instanceListeners.set(workspaceId, listener);
        return listener;
    }
    async reconnect() {
        var _a;
        if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.onReconnect) {
            await this.options.onReconnect();
        }
    }
}
exports.CodestackServiceImpl = CodestackServiceImpl;
//# sourceMappingURL=codestack-service.js.map