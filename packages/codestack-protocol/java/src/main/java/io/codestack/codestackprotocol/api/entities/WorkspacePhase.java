// Copyright (c) 2022 Codestack GmbH. All rights reserved.
// Licensed under the GNU Affero General Public License (AGPL).
// See License.AGPL.txt in the project root for license information.

package io.codestack.codestackprotocol.api.entities;

public enum WorkspacePhase {
    unknown,
    preparing,
    pending,
    creating,
    initializing,
    running,
    interrupted,
    stopping,
    stopped
}
