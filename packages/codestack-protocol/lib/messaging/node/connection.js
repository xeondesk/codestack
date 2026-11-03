"use strict";
/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toIWebSocket = toIWebSocket;
exports.createWebSocketConnection = createWebSocketConnection;
const vscode_ws_jsonrpc_1 = require("vscode-ws-jsonrpc");
const logging_1 = require("../../util/logging");
function toIWebSocket(ws) {
    return {
        send: (content) => {
            if (ws.readyState >= ws.CLOSING) {
                // ws is already CLOSING/CLOSED, send() would just return an error.
                return;
            }
            // in general send-errors should trigger an 'error' event already, we just make sure it actually happens.
            try {
                ws.send(content, (err) => {
                    if (!err) {
                        return;
                    }
                    ws.emit("error", err);
                });
            }
            catch (err) {
                ws.emit("error", err);
            }
        },
        onMessage: (cb) => ws.on("message", cb),
        onError: (cb) => ws.on("error", cb),
        onClose: (cb) => ws.on("close", cb),
        dispose: () => {
            if (ws.readyState < ws.CLOSING) {
                ws.close();
            }
        },
    };
}
// copied from /node_modules/vscode-ws-jsonrpc/lib/socket/connection.js
function createWebSocketConnection(socket, logger) {
    const messageReader = new SafeWebSocketMessageReader(socket);
    const messageWriter = new vscode_ws_jsonrpc_1.WebSocketMessageWriter(socket);
    const connection = (0, vscode_ws_jsonrpc_1.createMessageConnection)(messageReader, messageWriter, logger);
    connection.onClose(() => connection.dispose());
    return connection;
}
class SafeWebSocketMessageReader extends vscode_ws_jsonrpc_1.WebSocketMessageReader {
    readMessage(message) {
        try {
            super.readMessage(message);
        }
        catch (error) {
            logging_1.log.debug("Failed to decode JSON-RPC message.", error);
        }
    }
}
//# sourceMappingURL=connection.js.map