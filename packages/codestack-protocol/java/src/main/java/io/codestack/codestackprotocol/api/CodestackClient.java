// Copyright (c) 2021 Codestack GmbH. All rights reserved.
// Licensed under the GNU Affero General Public License (AGPL).
// See License.AGPL.txt in the project root for license information.

package io.codestack.codestackprotocol.api;

import io.codestack.codestackprotocol.api.entities.WorkspaceInstance;
import org.eclipse.lsp4j.jsonrpc.services.JsonNotification;

public class CodestackClient {

    private CodestackServer server;

    public void connect(CodestackServer server) {
        this.server = server;
    }

    public CodestackServer getServer() {
        if (this.server == null) {
            throw new IllegalStateException("not connected");
        }
        return this.server;
    }

    public void notifyConnect() {
    }

    @JsonNotification
    public void onInstanceUpdate(WorkspaceInstance instance) {

    }
}
