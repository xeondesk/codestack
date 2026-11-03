import ws from "ws";
import { IWebSocket, Logger } from "vscode-ws-jsonrpc";
export declare function toIWebSocket(ws: ws): IWebSocket;
export declare function createWebSocketConnection(socket: IWebSocket, logger: Logger): import("vscode-jsonrpc").MessageConnection;
//# sourceMappingURL=connection.d.ts.map