"use strict";
/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindowMessageReader = exports.WindowMessageWriter = void 0;
exports.createWindowMessageConnection = createWindowMessageConnection;
const messageWriter_1 = require("vscode-jsonrpc/lib/messageWriter");
const messageReader_1 = require("vscode-jsonrpc/lib/messageReader");
const main_1 = require("vscode-jsonrpc/lib/main");
const vscode_ws_jsonrpc_1 = require("vscode-ws-jsonrpc");
function isWindowMessage(value) {
    return (!!value &&
        typeof value === "object" &&
        "jsonrpc" in value &&
        typeof value["jsonrpc"] === "string" &&
        "serviceId" in value &&
        typeof value["serviceId"] === "string");
}
class WindowMessageWriter extends messageWriter_1.AbstractMessageWriter {
    constructor(serviceId, window, targetOrigin) {
        super();
        this.serviceId = serviceId;
        this.window = window;
        this.targetOrigin = targetOrigin;
    }
    write(msg) {
        const { serviceId } = this;
        this.window.postMessage(Object.assign(msg, { serviceId }), this.targetOrigin);
    }
}
exports.WindowMessageWriter = WindowMessageWriter;
class WindowMessageReader extends messageReader_1.AbstractMessageReader {
    constructor(serviceId, sourceOrigin) {
        super();
        this.serviceId = serviceId;
        this.sourceOrigin = sourceOrigin;
        this.buffer = [];
        window.addEventListener("message", (event) => {
            if (this.sourceOrigin !== "*" && event.origin !== this.sourceOrigin) {
                return;
            }
            if (!isWindowMessage(event.data) || event.data.serviceId !== this.serviceId) {
                return;
            }
            if (this.callback) {
                this.callback(event.data);
            }
            else {
                this.buffer.push(event.data);
            }
        }, false);
    }
    listen(callback) {
        let message;
        while ((message = this.buffer.pop())) {
            callback(message);
        }
        Object.freeze(this.buffer);
        this.callback = callback;
    }
}
exports.WindowMessageReader = WindowMessageReader;
function createWindowMessageConnection(serviceId, window, sourceOrigin, targetOrigin = sourceOrigin) {
    const reader = new WindowMessageReader(serviceId, sourceOrigin);
    const writer = new WindowMessageWriter(serviceId, window, targetOrigin);
    return (0, main_1.createMessageConnection)(reader, writer, new vscode_ws_jsonrpc_1.ConsoleLogger());
}
//# sourceMappingURL=window-connection.js.map