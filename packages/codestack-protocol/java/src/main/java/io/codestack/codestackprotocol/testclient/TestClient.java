// Copyright (c) 2021 Codestack GmbH. All rights reserved.
// Licensed under the GNU Affero General Public License (AGPL).
// See License.AGPL.txt in the project root for license information.

package io.codestack.codestackprotocol.testclient;

import io.codestack.codestackprotocol.api.CodestackClient;
import io.codestack.codestackprotocol.api.CodestackServer;
import io.codestack.codestackprotocol.api.CodestackServerLauncher;
import io.codestack.codestackprotocol.api.entities.SendHeartBeatOptions;
import io.codestack.codestackprotocol.api.entities.User;

import java.util.Collections;

public class TestClient {
    public static void main(String[] args) throws Exception {
        String uri = "wss://codestack.io/api/v1";
        String token = "CHANGE-ME";
        String origin = "https://CHANGE-ME.codestack.io/";

        CodestackClient client = new CodestackClient();
        CodestackServerLauncher.create(client).listen(uri, origin, token, "Test", "Test", Collections.emptyList(), null);
        CodestackServer codestackServer = client.getServer();
        User user = codestackServer.getLoggedInUser().join();
        System.out.println("logged in user:" + user);

        Void result = codestackServer
                .sendHeartBeat(new SendHeartBeatOptions("CHANGE-ME", false)).join();
        System.out.println("send heart beat:" + result);
    }
}
