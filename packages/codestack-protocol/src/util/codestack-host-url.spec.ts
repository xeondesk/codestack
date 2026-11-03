/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */

import * as chai from "chai";
import { suite, test } from "@testdeck/mocha";
import { CodestackHostUrl } from "./codestack-host-url";
const expect = chai.expect;

@suite
export class CodestackHostUrlTest {
    @test public parseWorkspaceId_hosts_withEnvVarsInjected() {
        const actual = new CodestackHostUrl(
            "https://gray-grasshopper-nfbitfia.ws-eu02.codestack-staging.com/#passedin=test%20value/https://github.com/khulnasoft-bot/codestack-test-repo",
        ).workspaceId;
        expect(actual).to.equal("gray-grasshopper-nfbitfia");
    }

    @test public async testWithoutWorkspacePrefix() {
        expect(
            new CodestackHostUrl("https://3000-moccasin-ferret-155799b3.ws-eu02.codestack-staging.com/")
                .withoutWorkspacePrefix()
                .toString(),
        ).to.equal("https://codestack-staging.com/");
    }

    @test public async testWithoutWorkspacePrefix2() {
        expect(new CodestackHostUrl("https://codestack-staging.com/").withoutWorkspacePrefix().toString()).to.equal(
            "https://codestack-staging.com/",
        );
    }

    @test public async testWithoutWorkspacePrefix3() {
        expect(
            new CodestackHostUrl("https://gray-rook-5523v5d8.ws-dev.my-branch-1234.staging.codestack-dev.com/")
                .withoutWorkspacePrefix()
                .toString(),
        ).to.equal("https://my-branch-1234.staging.codestack-dev.com/");
    }

    @test public async testWithoutWorkspacePrefix4() {
        expect(
            new CodestackHostUrl("https://my-branch-1234.staging.codestack-dev.com/").withoutWorkspacePrefix().toString(),
        ).to.equal("https://my-branch-1234.staging.codestack-dev.com/");
    }

    @test public async testWithoutWorkspacePrefix5() {
        expect(
            new CodestackHostUrl("https://abc-nice-brunch-4224.staging.codestack-dev.com/")
                .withoutWorkspacePrefix()
                .toString(),
        ).to.equal("https://abc-nice-brunch-4224.staging.codestack-dev.com/");
    }

    @test public async testWithoutWorkspacePrefix6() {
        expect(
            new CodestackHostUrl("https://gray-rook-5523v5d8.ws-dev.abc-nice-brunch-4224.staging.codestack-dev.com/")
                .withoutWorkspacePrefix()
                .toString(),
        ).to.equal("https://abc-nice-brunch-4224.staging.codestack-dev.com/");
    }
}
module.exports = new CodestackHostUrlTest();
