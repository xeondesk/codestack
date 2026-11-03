/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
import { EncryptedData, EncryptionEngine } from "./encryption-engine";
import { KeyProvider, KeyMetadata } from "./key-provider";
export interface Encrypted<_T> extends EncryptedData {
    keyMetadata: KeyMetadata;
}
export declare const EncryptionService: unique symbol;
export interface EncryptionService {
    encrypt<T>(data: T): Encrypted<T>;
    decrypt<T>(encrypted: Encrypted<T>): T;
}
export declare class EncryptionServiceImpl implements EncryptionService {
    protected readonly engine: EncryptionEngine;
    protected readonly keyProvider: KeyProvider;
    encrypt<T>(data: T): Encrypted<T>;
    decrypt<T>(encrypted: Encrypted<T>): T;
    protected serialize(data: any): string;
    protected deserialize<T>(data: string): T;
}
/** HACK ahead: Some entities - namely DBTokenEntry for now - need access to an EncryptionService so we publish it here */
export declare namespace GlobalEncryptionService {
    let encryptionService: EncryptionService;
}
export declare function getGlobalEncryptionService(): EncryptionService;
//# sourceMappingURL=encryption-service.d.ts.map