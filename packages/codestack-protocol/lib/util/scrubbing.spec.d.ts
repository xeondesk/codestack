/**
 * Copyright (c) 2023 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
export declare class ScrubbingTest {
    testValue_EmptyString(): void;
    testValue_Email(): void;
    testValue_EmailInText(): void;
    testKeyValue_Email(): void;
    testKeyValue_AuthorEmail(): void;
    testKeyValue_Token(): void;
    testKeyValue_OwnerToken(): void;
    testKeyValue_NestedObject(): void;
    testKeyValue_NoNestedObject(): void;
    testKeyValue_NestedArray(): void;
    testKeyValue_NoNestedArray(): void;
    testKeyValue_Scrubbable(): void;
    testAnalyticsProperties_URLScrubbing(): void;
    testURL_PatternScrubbing(): void;
    testURL_NonGitURLsNotScrubbed(): void;
    testURL_MixedURLTypes(): void;
    testURL_HttpGitURLs(): void;
}
//# sourceMappingURL=scrubbing.spec.d.ts.map