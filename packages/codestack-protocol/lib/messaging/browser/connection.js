"use strict";
/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketConnectionProvider = void 0;
const vscode_ws_jsonrpc_1 = require("vscode-ws-jsonrpc");
const vscode_jsonrpc_1 = require("vscode-jsonrpc");
const messageWriter_1 = require("vscode-jsonrpc/lib/messageWriter");
const messageReader_1 = require("vscode-jsonrpc/lib/messageReader");
const proxy_factory_1 = require("../proxy-factory");
const reconnecting_websocket_1 = __importDefault(require("reconnecting-websocket"));
const logging_1 = require("../../util/logging");
class WebSocketConnectionProvider {
    /**
     * Create a proxy object to remote interface of T type
     * over a web socket connection for the given path.
     *
     * An optional target can be provided to handle
     * notifications and requests from a remote side.
     */
    createProxy(path, target, options) {
        const factory = new proxy_factory_1.JsonRpcProxyFactory(target);
        const startListening = (path) => {
            const socket = this.listen({
                path,
                onConnection: (c) => factory.listen(c),
            }, {
                onTransportDidClose: () => factory.fireConnectionClosed(),
                onTransportDidOpen: () => factory.fireConnectionOpened(),
            }, options);
            if (options === null || options === void 0 ? void 0 : options.onListening) {
                options.onListening(socket);
            }
        };
        if (typeof path === "string") {
            startListening(path);
        }
        else {
            path.then((path) => startListening(path));
        }
        return factory.createProxy();
    }
    /**
     * Install a connection handler for the given path.
     */
    listen(handler, eventHandler, options) {
        const url = handler.path;
        const webSocket = this.createWebSocket(url);
        const logger = this.createLogger();
        if (options && options.onerror) {
            const onerror = options.onerror;
            webSocket.addEventListener("error", (event) => {
                onerror(event);
            });
        }
        else {
            webSocket.addEventListener("error", (error) => {
                logger.error(JSON.stringify(error));
            });
        }
        doListen(webSocket, handler, eventHandler, logger);
        return webSocket;
    }
    createLogger() {
        return new vscode_ws_jsonrpc_1.ConsoleLogger();
    }
    /**
     * Creates a web socket for the given url
     */
    createWebSocket(url, WebSocketConstructor = WebSocket) {
        return new reconnecting_websocket_1.default(url, undefined, {
            maxReconnectionDelay: 10000,
            minReconnectionDelay: 1000,
            reconnectionDelayGrowFactor: 1.3,
            maxRetries: Infinity,
            debug: false,
            WebSocket: WebSocketConstructor,
        });
    }
}
exports.WebSocketConnectionProvider = WebSocketConnectionProvider;
// The following was extracted from vscode-ws-jsonrpc to make these changes:
//  - switch from WebSocket to ReconnectingWebSocket
//  - webSocket.onopen: making sure it's only ever called once so we're re-using MessageConnection
//  - WebSocketMessageWriter: buffer and re-try messages instead of throwing an error immidiately
//  - WebSocketMessageReader: don't close MessageConnection on 'socket.onclose'
function doListen(resocket, handler, eventHandler, logger) {
    resocket.addEventListener("close", () => eventHandler.onTransportDidClose());
    let alreadyOpened = false;
    resocket.onopen = () => {
        // trigerr "open" every time we re-open the underlying websocket
        eventHandler.onTransportDidOpen();
        // make sure we're only ever creating one MessageConnection, irregardless of how many times we have to re-open the underlying (reconnecting) websocket
        if (alreadyOpened) {
            return;
        }
        alreadyOpened = true;
        const connection = createWebSocketConnection(resocket, logger);
        handler.onConnection(connection);
    };
}
function createWebSocketConnection(resocket, logger) {
    const socket = (0, vscode_ws_jsonrpc_1.toSocket)(resocket);
    const messageReader = new NonClosingWebSocketMessageReader(socket);
    const messageWriter = new BufferingWebSocketMessageWriter(resocket, logger);
    const connection = (0, vscode_jsonrpc_1.createMessageConnection)(messageReader, messageWriter, logger);
    connection.onClose(() => connection.dispose());
    return connection;
}
/**
 * This takes vscode-ws-jsonrpc/lib/socket/writer/WebSocketMessageWriter and adds a buffer
 */
class BufferingWebSocketMessageWriter extends messageWriter_1.AbstractMessageWriter {
    constructor(socket, logger) {
        super();
        this.errorCount = 0;
        this.buffer = [];
        this.socket = socket;
        this.logger = logger;
        socket.addEventListener("open", (event) => this.flushBuffer());
    }
    write(msg) {
        if (this.socket.readyState !== reconnecting_websocket_1.default.OPEN) {
            this.bufferMsg(msg);
            return;
        }
        try {
            const content = JSON.stringify(msg);
            this.socket.send(content);
        }
        catch (e) {
            this.errorCount++;
            this.fireError(e, msg, this.errorCount);
            this.bufferMsg(msg);
        }
    }
    flushBuffer() {
        if (this.buffer.length === 0) {
            return;
        }
        const buffer = [...this.buffer];
        this.buffer = [];
        for (const msg of buffer) {
            this.write(msg);
        }
        //this.logger.info(`flushed buffer (${this.buffer.length})`)
    }
    bufferMsg(msg) {
        this.buffer.push(msg);
        //this.logger.info(`buffered message (${this.buffer.length})`);
    }
}
/**
 * This takes vscode-ws-jsonrpc/lib/socket/reader/WebSocketMessageReader and removes the "onClose -> fireClose" connection
 */
class NonClosingWebSocketMessageReader extends messageReader_1.AbstractMessageReader {
    constructor(socket) {
        super();
        this.events = [];
        this.state = "initial";
        this.callback = () => { };
        this.socket = socket;
        this.socket.onMessage((message) => this.readMessage(message));
        this.socket.onError((error) => this.fireError(error));
        this.socket.onClose((code, reason) => {
            if (code !== 1000) {
                const error = {
                    name: "" + code,
                    message: `Error during socket reconnect: code = ${code}, reason = ${reason}`,
                };
                this.fireError(error);
            }
            // this.fireClose();        // <-- reason for this class to be copied over
        });
    }
    listen(callback) {
        if (this.state === "initial") {
            this.state = "listening";
            this.callback = callback;
            while (this.events.length !== 0) {
                const event = this.events.pop();
                if (event.message) {
                    this.readMessage(event.message);
                }
                else if (event.error) {
                    this.fireError(event.error);
                }
                else {
                    this.fireClose();
                }
            }
        }
    }
    readMessage(message) {
        if (this.state === "initial") {
            this.events.splice(0, 0, { message });
        }
        else if (this.state === "listening") {
            try {
                const data = JSON.parse(message);
                this.callback(data);
            }
            catch (error) {
                logging_1.log.debug("Failed to decode JSON-RPC message.", error);
            }
        }
    }
    fireError(error) {
        if (this.state === "initial") {
            this.events.splice(0, 0, { error });
        }
        else if (this.state === "listening") {
            super.fireError(error);
        }
    }
    fireClose() {
        if (this.state === "initial") {
            this.events.splice(0, 0, {});
        }
        else if (this.state === "listening") {
            super.fireClose();
        }
        this.state = "closed";
    }
}
//# sourceMappingURL=connection.js.map