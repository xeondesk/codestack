// Copyright (c) 2022 Codestack GmbH. All rights reserved.
// Licensed under the GNU Affero General Public License (AGPL).
// See License.AGPL.txt in the project root for license information.

package io.codestack.codestackprotocol.api;

import javax.websocket.CloseReason;
import javax.websocket.Session;
import java.io.IOException;
import java.util.concurrent.CompletableFuture;
import java.util.logging.Level;
import java.util.logging.Logger;

public class CodestackServerConnectionImpl extends CompletableFuture<CloseReason> implements CodestackServerConnection {

    public static final Logger LOG = Logger.getLogger(CodestackServerConnectionImpl.class.getName());

    private final String codestackHost;

    private Session session;

    public CodestackServerConnectionImpl(String codestackHost) {
        this.codestackHost = codestackHost;
    }

    public void setSession(Session session) {
        this.session = session;
    }

    @Override
    public boolean cancel(boolean mayInterruptIfRunning) {
        Session session = this.session;
        this.session = null;
        if (session != null) {
            try {
                session.close();
            } catch (IOException e) {
                LOG.log(Level.WARNING, codestackHost + ": failed to close connection:", e);
            }
        }
        return super.cancel(mayInterruptIfRunning);
    }
}
