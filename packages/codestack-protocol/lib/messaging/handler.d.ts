import { MessageConnection } from "vscode-jsonrpc";
export declare const ConnectionHandler: unique symbol;
export interface ConnectionHandler {
    readonly path: string;
    onConnection(connection: MessageConnection, session?: object): void;
}
export interface ConnectionEventHandler {
    /**
     * Called when the transport underpinning the connection got closed
     */
    onTransportDidClose(): void;
    /**
     * Called when the transport underpinning the connection is (re-)opened
     */
    onTransportDidOpen(): void;
}
//# sourceMappingURL=handler.d.ts.map