"use strict";
/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthProviderEntry = exports.WorkspaceCreationResult = exports.WorkspaceInfo = exports.WorkspaceInstancePortsChangedEvent = exports.NavigatorContext = exports.IssueContext = exports.PullRequestContext = exports.CommitContext = exports.OpenPrebuildContext = exports.AdditionalContentContext = exports.RefType = exports.WithEnvvarsContext = exports.WithReferrerContext = exports.PrebuiltWorkspaceContext = exports.StartPrebuildContext = exports.SnapshotContext = exports.WithDefaultConfig = exports.WithPrebuild = exports.WithSnapshot = exports.WorkspaceContext = exports.ExternalImageConfigFile = exports.ImageConfigFile = exports.ImageConfigString = exports.WorkspaceImageBuild = exports.TaskConfig = exports.PortRangeConfig = exports.PortConfig = exports.PrebuiltWorkspace = exports.WorkspaceImageSourceReference = exports.WorkspaceImageSourceDocker = exports.GithubAppPrebuildConfig = exports.Workspace = exports.Identity = exports.CodestackTokenType = exports.SSHPublicKeyValue = exports.UserEnvVar = exports.EnvVar = exports.NamedWorkspaceFeatureFlag = exports.WorkspaceFeatureFlags = exports.AdditionalUserData = exports.User = void 0;
const crypto_1 = require("crypto");
var User;
(function (User) {
    function is(data) {
        return data && data.hasOwnProperty("id") && data.hasOwnProperty("identities");
    }
    User.is = is;
    function getIdentity(user, authProviderId) {
        return user.identities.find((id) => id.authProviderId === authProviderId);
    }
    User.getIdentity = getIdentity;
    function isOrganizationOwned(user) {
        return !!user.organizationId;
    }
    User.isOrganizationOwned = isOrganizationOwned;
})(User || (exports.User = User = {}));
var AdditionalUserData;
(function (AdditionalUserData) {
    function set(user, partialData) {
        if (!user.additionalData) {
            user.additionalData = {
                ...partialData,
            };
        }
        else {
            user.additionalData = {
                ...user.additionalData,
                ...partialData,
            };
        }
        return user;
    }
    AdditionalUserData.set = set;
})(AdditionalUserData || (exports.AdditionalUserData = AdditionalUserData = {}));
/**
 * The values of this type MUST MATCH enum values in WorkspaceFeatureFlag from ws-manager/client/core_pb.d.ts
 * If they don't we'll break things during workspace startup.
 */
exports.WorkspaceFeatureFlags = {
    full_workspace_backup: undefined,
    workspace_class_limiting: undefined,
    workspace_connection_limiting: undefined,
    workspace_psi: undefined,
    ssh_ca: undefined,
};
var NamedWorkspaceFeatureFlag;
(function (NamedWorkspaceFeatureFlag) {
    NamedWorkspaceFeatureFlag.WORKSPACE_PERSISTED_FEATTURE_FLAGS = ["full_workspace_backup"];
    function isWorkspacePersisted(ff) {
        return NamedWorkspaceFeatureFlag.WORKSPACE_PERSISTED_FEATTURE_FLAGS.includes(ff);
    }
    NamedWorkspaceFeatureFlag.isWorkspacePersisted = isWorkspacePersisted;
})(NamedWorkspaceFeatureFlag || (exports.NamedWorkspaceFeatureFlag = NamedWorkspaceFeatureFlag = {}));
var EnvVar;
(function (EnvVar) {
    EnvVar.CODESTACK_IMAGE_AUTH_ENV_VAR_NAME = "CODESTACK_IMAGE_AUTH";
    /**
     * - CODESTACK_IMAGE_AUTH is documented https://www.codestack.io/docs/configure/workspaces/workspace-image#use-a-private-docker-image
     */
    EnvVar.WhiteListFromReserved = [EnvVar.CODESTACK_IMAGE_AUTH_ENV_VAR_NAME];
    function is(data) {
        return data.hasOwnProperty("name") && data.hasOwnProperty("value");
    }
    EnvVar.is = is;
    /**
     * Extracts the "host:credentials" pairs from the CODESTACK_IMAGE_AUTH environment variable.
     * @param envVars
     * @returns A map of host to credentials
     */
    function getCodestackImageAuth(envVars) {
        const res = new Map();
        const imageAuth = envVars.find((e) => e.name === EnvVar.CODESTACK_IMAGE_AUTH_ENV_VAR_NAME);
        if (!imageAuth) {
            return res;
        }
        const parse = (parts) => {
            if (parts.some((e) => e === "")) {
                return undefined;
            }
            if (parts.length === 2) {
                return { host: parts[0], auth: parts[1] };
            }
            else if (parts.length === 3) {
                return { host: `${parts[0]}:${parts[1]}`, auth: parts[2] };
            }
            return undefined;
        };
        (imageAuth.value || "")
            .split(",")
            .map((e) => e.split(":").map((part) => part.trim()))
            .forEach((parts) => {
            const parsed = parse(parts);
            if (parsed) {
                res.set(parsed.host, parsed.auth);
            }
        });
        return res;
    }
    EnvVar.getCodestackImageAuth = getCodestackImageAuth;
})(EnvVar || (exports.EnvVar = EnvVar = {}));
var UserEnvVar;
(function (UserEnvVar) {
    UserEnvVar.DELIMITER = "/";
    UserEnvVar.WILDCARD_ASTERISK = "*";
    // This wildcard is only allowed on the last segment, and matches arbitrary segments to the right
    UserEnvVar.WILDCARD_DOUBLE_ASTERISK = "**";
    const WILDCARD_SHARP = "#"; // TODO(gpl) Where does this come from? Bc we have/had patterns as part of URLs somewhere, maybe...?
    const MIN_PATTERN_SEGMENTS = 2;
    function isWildcard(c) {
        return c === UserEnvVar.WILDCARD_ASTERISK || c === WILDCARD_SHARP;
    }
    function is(data) {
        return (EnvVar.is(data) &&
            data.hasOwnProperty("id") &&
            data.hasOwnProperty("userId") &&
            data.hasOwnProperty("repositoryPattern"));
    }
    UserEnvVar.is = is;
    /**
     * @param variable
     * @returns Either a string containing an error message or undefined.
     */
    function validate(variable) {
        const name = variable.name;
        const pattern = variable.repositoryPattern;
        if (!EnvVar.WhiteListFromReserved.includes(name) && name.startsWith("CODESTACK_")) {
            return "Name with prefix 'CODESTACK_' is reserved.";
        }
        if (name.trim() === "") {
            return "Name must not be empty.";
        }
        if (name.length > 255) {
            return "Name too long. Maximum name length is 255 characters.";
        }
        if (!/^[a-zA-Z_]+[a-zA-Z0-9_]*$/.test(name)) {
            return "Name must match /^[a-zA-Z_]+[a-zA-Z0-9_]*$/.";
        }
        if (variable.value.trim() === "") {
            return "Value must not be empty.";
        }
        if (variable.value.length > 32767) {
            return "Value too long. Maximum value length is 32767 characters.";
        }
        if (pattern.trim() === "") {
            return "Scope must not be empty.";
        }
        const split = splitRepositoryPattern(pattern);
        if (split.length < MIN_PATTERN_SEGMENTS) {
            return "A scope must use the form 'organization/repo'.";
        }
        for (const name of split) {
            if (name !== "*") {
                if (!/^[a-zA-Z0-9_\-.\*]+$/.test(name)) {
                    return "Invalid scope segment. Only ASCII characters, numbers, -, _, . or * are allowed.";
                }
            }
        }
        return undefined;
    }
    UserEnvVar.validate = validate;
    function normalizeRepoPattern(pattern) {
        return pattern.toLocaleLowerCase();
    }
    UserEnvVar.normalizeRepoPattern = normalizeRepoPattern;
    function splitRepositoryPattern(pattern) {
        return pattern.split(UserEnvVar.DELIMITER);
    }
    function joinRepositoryPattern(...parts) {
        return parts.join(UserEnvVar.DELIMITER);
    }
    /**
     * Matches the given EnvVar pattern against the fully qualified name of the repository:
     *  - GitHub: "repo/owner"
     *  - GitLab: "some/nested/repo" (up to MAX_PATTERN_SEGMENTS deep)
     * @param pattern
     * @param repoFqn
     * @returns True if the pattern matches that fully qualified name
     */
    function matchEnvVarPattern(pattern, repoFqn) {
        const fqnSegments = splitRepositoryPattern(repoFqn);
        const patternSegments = splitRepositoryPattern(pattern);
        if (patternSegments.length < MIN_PATTERN_SEGMENTS) {
            // Technically not a problem, but we should not allow this for safety reasons.
            // And because we hisotrically never allowed this (GitHub would always require at least "*/*") we are just keeping old constraints.
            // Note: Most importantly this guards against arbitrary wildcard matches
            return false;
        }
        function isWildcardMatch(patternSegment, isLastSegment) {
            if (isWildcard(patternSegment)) {
                return true;
            }
            return isLastSegment && patternSegment === UserEnvVar.WILDCARD_DOUBLE_ASTERISK;
        }
        let i = 0;
        for (; i < patternSegments.length; i++) {
            if (i >= fqnSegments.length) {
                return false;
            }
            const fqnSegment = fqnSegments[i];
            const patternSegment = patternSegments[i];
            const isLastSegment = patternSegments.length === i + 1;
            if (!isWildcardMatch(patternSegment, isLastSegment) && patternSegment !== fqnSegment.toLocaleLowerCase()) {
                return false;
            }
        }
        if (fqnSegments.length > i) {
            // Special case: "**" as last segment matches arbitrary # of segments to the right
            if (patternSegments[i - 1] === UserEnvVar.WILDCARD_DOUBLE_ASTERISK) {
                return true;
            }
            return false;
        }
        return true;
    }
    UserEnvVar.matchEnvVarPattern = matchEnvVarPattern;
    // Matches the following patterns for "some/nested/repo", ordered by highest score:
    //  - exact: some/nested/repo ()
    //  - partial:
    //    - some/nested/*
    //    - some/*
    //  - generic:
    //    - */*/*
    //    - */*
    // Does NOT match:
    //  - */repo (number of parts does not match)
    // cmp. test cases in env-var-service.spec.ts
    function filter(vars, owner, repo) {
        const matchedEnvVars = vars.filter((e) => matchEnvVarPattern(e.repositoryPattern, joinRepositoryPattern(owner, repo)));
        const resmap = new Map();
        matchedEnvVars.forEach((e) => {
            const l = resmap.get(e.name) || [];
            l.push(e);
            resmap.set(e.name, l);
        });
        // In cases of multiple matches per env var: find the best match
        // Best match is the most specific pattern, where the left-most segment is most significant
        function scoreMatchedEnvVar(e) {
            function valueSegment(segment) {
                switch (segment) {
                    case UserEnvVar.WILDCARD_ASTERISK:
                        return 2;
                    case WILDCARD_SHARP:
                        return 2;
                    case UserEnvVar.WILDCARD_DOUBLE_ASTERISK:
                        return 1;
                    default:
                        return 3;
                }
            }
            const patternSegments = splitRepositoryPattern(e.repositoryPattern);
            let result = 0;
            for (const segment of patternSegments) {
                // We can assume the pattern matches from context, so we just need to check whether it's a wildcard or not
                const val = valueSegment(segment);
                result = result * 10 + val;
            }
            return result;
        }
        const result = [];
        for (const name of resmap.keys()) {
            const candidates = resmap.get(name);
            if (!candidates) {
                // not sure how this can happen, but so be it
                continue;
            }
            if (candidates.length == 1) {
                result.push(candidates[0]);
                continue;
            }
            let bestCandidate = candidates[0];
            let bestScore = scoreMatchedEnvVar(bestCandidate);
            for (const e of candidates.slice(1)) {
                const score = scoreMatchedEnvVar(e);
                if (score > bestScore) {
                    bestScore = score;
                    bestCandidate = e;
                }
            }
            result.push(bestCandidate);
        }
        return result;
    }
    UserEnvVar.filter = filter;
})(UserEnvVar || (exports.UserEnvVar = UserEnvVar = {}));
var SSHPublicKeyValue;
(function (SSHPublicKeyValue) {
    function validate(value) {
        if (value.name.length === 0) {
            return "Title must not be empty.";
        }
        if (value.name.length > 255) {
            return "Title too long. Maximum value length is 255 characters.";
        }
        if (value.key.length === 0) {
            return "Key must not be empty.";
        }
        try {
            getData(value);
        }
        catch (e) {
            return "Key is invalid. You must supply a key in OpenSSH public key format.";
        }
        return;
    }
    SSHPublicKeyValue.validate = validate;
    function getData(value) {
        var _a, _b, _c;
        // Begins with 'ssh-rsa', 'ecdsa-sha2-nistp256', 'ecdsa-sha2-nistp384', 'ecdsa-sha2-nistp521', 'ssh-ed25519', 'sk-ecdsa-sha2-nistp256@openssh.com', or 'sk-ssh-ed25519@openssh.com'.
        const regex = /^(?<type>ssh-rsa|ecdsa-sha2-nistp256|ecdsa-sha2-nistp384|ecdsa-sha2-nistp521|ssh-ed25519|sk-ecdsa-sha2-nistp256@openssh\.com|sk-ssh-ed25519@openssh\.com) (?<key>.*?)( (?<email>.*?))?$/;
        const resultGroup = regex.exec(value.key.trim());
        if (!resultGroup) {
            throw new Error("Key is invalid.");
        }
        return {
            type: (_a = resultGroup.groups) === null || _a === void 0 ? void 0 : _a["type"],
            key: (_b = resultGroup.groups) === null || _b === void 0 ? void 0 : _b["key"],
            email: ((_c = resultGroup.groups) === null || _c === void 0 ? void 0 : _c["email"]) || undefined,
        };
    }
    SSHPublicKeyValue.getData = getData;
    function getFingerprint(value) {
        const data = getData(value);
        const buf = Buffer.from(data.key, "base64");
        // gitlab style
        // const hash = createHash("md5").update(buf).digest("hex");
        // github style
        const hash = (0, crypto_1.createHash)("sha256").update(buf).digest("base64");
        return hash;
    }
    SSHPublicKeyValue.getFingerprint = getFingerprint;
    SSHPublicKeyValue.MAXIMUM_KEY_LENGTH = 5;
})(SSHPublicKeyValue || (exports.SSHPublicKeyValue = SSHPublicKeyValue = {}));
var CodestackTokenType;
(function (CodestackTokenType) {
    CodestackTokenType[CodestackTokenType["API_AUTH_TOKEN"] = 0] = "API_AUTH_TOKEN";
    CodestackTokenType[CodestackTokenType["MACHINE_AUTH_TOKEN"] = 1] = "MACHINE_AUTH_TOKEN";
})(CodestackTokenType || (exports.CodestackTokenType = CodestackTokenType = {}));
var Identity;
(function (Identity) {
    function is(data) {
        return (data.hasOwnProperty("authProviderId") && data.hasOwnProperty("authId") && data.hasOwnProperty("authName"));
    }
    Identity.is = is;
    function equals(id1, id2) {
        return id1.authProviderId === id2.authProviderId && id1.authId === id2.authId;
    }
    Identity.equals = equals;
})(Identity || (exports.Identity = Identity = {}));
var Workspace;
(function (Workspace) {
    function getPullRequestNumber(ws) {
        if (PullRequestContext.is(ws.context)) {
            return ws.context.nr;
        }
        return undefined;
    }
    Workspace.getPullRequestNumber = getPullRequestNumber;
    function getIssueNumber(ws) {
        if (IssueContext.is(ws.context)) {
            return ws.context.nr;
        }
        return undefined;
    }
    Workspace.getIssueNumber = getIssueNumber;
    function getBranchName(ws) {
        if (CommitContext.is(ws.context)) {
            return ws.context.ref;
        }
        return undefined;
    }
    Workspace.getBranchName = getBranchName;
    function getCommit(ws) {
        if (CommitContext.is(ws.context)) {
            return ws.context.revision && ws.context.revision.substr(0, 8);
        }
        return undefined;
    }
    Workspace.getCommit = getCommit;
    const NAME_PREFIX = "named:";
    function fromWorkspaceName(name) {
        if (name === null || name === void 0 ? void 0 : name.startsWith(NAME_PREFIX)) {
            return name.slice(NAME_PREFIX.length);
        }
        return undefined;
    }
    Workspace.fromWorkspaceName = fromWorkspaceName;
    function toWorkspaceName(name) {
        if (!name || (name === null || name === void 0 ? void 0 : name.trim().length) === 0) {
            return "no-name";
        }
        return `${NAME_PREFIX}${name}`;
    }
    Workspace.toWorkspaceName = toWorkspaceName;
})(Workspace || (exports.Workspace = Workspace = {}));
var GithubAppPrebuildConfig;
(function (GithubAppPrebuildConfig) {
    function is(obj) {
        return !(typeof obj === "boolean");
    }
    GithubAppPrebuildConfig.is = is;
})(GithubAppPrebuildConfig || (exports.GithubAppPrebuildConfig = GithubAppPrebuildConfig = {}));
var WorkspaceImageSourceDocker;
(function (WorkspaceImageSourceDocker) {
    function is(obj) {
        return "dockerFileHash" in obj && "dockerFilePath" in obj;
    }
    WorkspaceImageSourceDocker.is = is;
})(WorkspaceImageSourceDocker || (exports.WorkspaceImageSourceDocker = WorkspaceImageSourceDocker = {}));
var WorkspaceImageSourceReference;
(function (WorkspaceImageSourceReference) {
    function is(obj) {
        return "baseImageResolved" in obj;
    }
    WorkspaceImageSourceReference.is = is;
})(WorkspaceImageSourceReference || (exports.WorkspaceImageSourceReference = WorkspaceImageSourceReference = {}));
var PrebuiltWorkspace;
(function (PrebuiltWorkspace) {
    function isDone(pws) {
        return (pws.state === "available" || pws.state === "timeout" || pws.state === "aborted" || pws.state === "failed");
    }
    PrebuiltWorkspace.isDone = isDone;
    function isAvailable(pws) {
        return pws.state === "available" && !!pws.snapshot;
    }
    PrebuiltWorkspace.isAvailable = isAvailable;
    function buildDidSucceed(pws) {
        return pws.state === "available" && !pws.error;
    }
    PrebuiltWorkspace.buildDidSucceed = buildDidSucceed;
})(PrebuiltWorkspace || (exports.PrebuiltWorkspace = PrebuiltWorkspace = {}));
var PortConfig;
(function (PortConfig) {
    function is(config) {
        return config && "port" in config && typeof config.port === "number";
    }
    PortConfig.is = is;
})(PortConfig || (exports.PortConfig = PortConfig = {}));
var PortRangeConfig;
(function (PortRangeConfig) {
    function is(config) {
        return config && "port" in config && (typeof config.port === "string" || config.port instanceof String);
    }
    PortRangeConfig.is = is;
})(PortRangeConfig || (exports.PortRangeConfig = PortRangeConfig = {}));
var TaskConfig;
(function (TaskConfig) {
    function is(config) {
        return config && ("command" in config || "init" in config || "before" in config);
    }
    TaskConfig.is = is;
})(TaskConfig || (exports.TaskConfig = TaskConfig = {}));
var WorkspaceImageBuild;
(function (WorkspaceImageBuild) {
    let LogLine;
    (function (LogLine) {
        LogLine.DELIMITER = "\r\n";
        LogLine.DELIMITER_REGEX = /\r?\n/;
    })(LogLine = WorkspaceImageBuild.LogLine || (WorkspaceImageBuild.LogLine = {}));
})(WorkspaceImageBuild || (exports.WorkspaceImageBuild = WorkspaceImageBuild = {}));
var ImageConfigString;
(function (ImageConfigString) {
    function is(config) {
        return typeof config === "string";
    }
    ImageConfigString.is = is;
})(ImageConfigString || (exports.ImageConfigString = ImageConfigString = {}));
var ImageConfigFile;
(function (ImageConfigFile) {
    function is(config) {
        return typeof config === "object" && "file" in config;
    }
    ImageConfigFile.is = is;
})(ImageConfigFile || (exports.ImageConfigFile = ImageConfigFile = {}));
var ExternalImageConfigFile;
(function (ExternalImageConfigFile) {
    function is(config) {
        return typeof config === "object" && "file" in config && "externalSource" in config;
    }
    ExternalImageConfigFile.is = is;
})(ExternalImageConfigFile || (exports.ExternalImageConfigFile = ExternalImageConfigFile = {}));
var WorkspaceContext;
(function (WorkspaceContext) {
    function is(context) {
        return context && "title" in context;
    }
    WorkspaceContext.is = is;
})(WorkspaceContext || (exports.WorkspaceContext = WorkspaceContext = {}));
var WithSnapshot;
(function (WithSnapshot) {
    function is(context) {
        return context && "snapshotBucketId" in context;
    }
    WithSnapshot.is = is;
})(WithSnapshot || (exports.WithSnapshot = WithSnapshot = {}));
var WithPrebuild;
(function (WithPrebuild) {
    function is(context) {
        return context && WithSnapshot.is(context) && "prebuildWorkspaceId" in context && "wasPrebuilt" in context;
    }
    WithPrebuild.is = is;
})(WithPrebuild || (exports.WithPrebuild = WithPrebuild = {}));
var WithDefaultConfig;
(function (WithDefaultConfig) {
    function is(context) {
        return context && "withDefaultConfig" in context && context.withDefaultConfig;
    }
    WithDefaultConfig.is = is;
    function mark(ctx) {
        return {
            ...ctx,
            withDefaultConfig: true,
        };
    }
    WithDefaultConfig.mark = mark;
})(WithDefaultConfig || (exports.WithDefaultConfig = WithDefaultConfig = {}));
var SnapshotContext;
(function (SnapshotContext) {
    function is(context) {
        return context && WithSnapshot.is(context) && "snapshotId" in context;
    }
    SnapshotContext.is = is;
})(SnapshotContext || (exports.SnapshotContext = SnapshotContext = {}));
var StartPrebuildContext;
(function (StartPrebuildContext) {
    function is(context) {
        return context && "actual" in context;
    }
    StartPrebuildContext.is = is;
})(StartPrebuildContext || (exports.StartPrebuildContext = StartPrebuildContext = {}));
var PrebuiltWorkspaceContext;
(function (PrebuiltWorkspaceContext) {
    function is(context) {
        return context && "originalContext" in context && "prebuiltWorkspace" in context;
    }
    PrebuiltWorkspaceContext.is = is;
})(PrebuiltWorkspaceContext || (exports.PrebuiltWorkspaceContext = PrebuiltWorkspaceContext = {}));
var WithReferrerContext;
(function (WithReferrerContext) {
    function is(context) {
        return context && "referrer" in context;
    }
    WithReferrerContext.is = is;
})(WithReferrerContext || (exports.WithReferrerContext = WithReferrerContext = {}));
var WithEnvvarsContext;
(function (WithEnvvarsContext) {
    function is(context) {
        return context && "envvars" in context;
    }
    WithEnvvarsContext.is = is;
})(WithEnvvarsContext || (exports.WithEnvvarsContext = WithEnvvarsContext = {}));
var RefType;
(function (RefType) {
    RefType.getRefType = (commit) => {
        if (!commit.ref) {
            return "revision";
        }
        // This fallback is meant to handle the cases where (for historic reasons) ref is present but refType is missing
        return commit.refType || "branch";
    };
})(RefType || (exports.RefType = RefType = {}));
var AdditionalContentContext;
(function (AdditionalContentContext) {
    function is(ctx) {
        return "additionalFiles" in ctx;
    }
    AdditionalContentContext.is = is;
    function hasDockerConfig(ctx, config) {
        return is(ctx) && ImageConfigFile.is(config.image) && !!ctx.additionalFiles[config.image.file];
    }
    AdditionalContentContext.hasDockerConfig = hasDockerConfig;
})(AdditionalContentContext || (exports.AdditionalContentContext = AdditionalContentContext = {}));
var OpenPrebuildContext;
(function (OpenPrebuildContext) {
    function is(ctx) {
        return "openPrebuildID" in ctx;
    }
    OpenPrebuildContext.is = is;
})(OpenPrebuildContext || (exports.OpenPrebuildContext = OpenPrebuildContext = {}));
var CommitContext;
(function (CommitContext) {
    /**
     * Creates a hash for all the commits of the CommitContext and all sub-repo commit infos.
     * The hash is max 255 chars long.
     * @param commitContext
     * @returns hash for commitcontext
     */
    function computeHash(commitContext) {
        // for single commits we use the revision to be backward compatible.
        if (!commitContext.additionalRepositoryCheckoutInfo ||
            commitContext.additionalRepositoryCheckoutInfo.length === 0) {
            return commitContext.revision;
        }
        const hasher = (0, crypto_1.createHash)("sha256");
        hasher.update(commitContext.revision);
        for (const info of commitContext.additionalRepositoryCheckoutInfo) {
            hasher.update(info.revision);
        }
        return hasher.digest("hex");
    }
    CommitContext.computeHash = computeHash;
    function isDefaultBranch(commitContext) {
        return commitContext.ref === commitContext.repository.defaultBranch;
    }
    CommitContext.isDefaultBranch = isDefaultBranch;
})(CommitContext || (exports.CommitContext = CommitContext = {}));
(function (CommitContext) {
    function is(commit) {
        return WorkspaceContext.is(commit) && "repository" in commit && "revision" in commit;
    }
    CommitContext.is = is;
})(CommitContext || (exports.CommitContext = CommitContext = {}));
var PullRequestContext;
(function (PullRequestContext) {
    function is(ctx) {
        return CommitContext.is(ctx) && "nr" in ctx && "ref" in ctx && "base" in ctx;
    }
    PullRequestContext.is = is;
})(PullRequestContext || (exports.PullRequestContext = PullRequestContext = {}));
var IssueContext;
(function (IssueContext) {
    function is(ctx) {
        return CommitContext.is(ctx) && "nr" in ctx && "ref" in ctx && "localBranch" in ctx;
    }
    IssueContext.is = is;
})(IssueContext || (exports.IssueContext = IssueContext = {}));
var NavigatorContext;
(function (NavigatorContext) {
    function is(ctx) {
        return CommitContext.is(ctx) && "path" in ctx && "isFile" in ctx;
    }
    NavigatorContext.is = is;
})(NavigatorContext || (exports.NavigatorContext = NavigatorContext = {}));
var WorkspaceInstancePortsChangedEvent;
(function (WorkspaceInstancePortsChangedEvent) {
    function is(data) {
        return data && data.type == "PortsChanged";
    }
    WorkspaceInstancePortsChangedEvent.is = is;
})(WorkspaceInstancePortsChangedEvent || (exports.WorkspaceInstancePortsChangedEvent = WorkspaceInstancePortsChangedEvent = {}));
var WorkspaceInfo;
(function (WorkspaceInfo) {
    function lastActiveISODate(info) {
        var _a;
        return ((_a = info.latestInstance) === null || _a === void 0 ? void 0 : _a.creationTime) || info.workspace.creationTime;
    }
    WorkspaceInfo.lastActiveISODate = lastActiveISODate;
})(WorkspaceInfo || (exports.WorkspaceInfo = WorkspaceInfo = {}));
var WorkspaceCreationResult;
(function (WorkspaceCreationResult) {
    function is(data) {
        return (data &&
            ("createdWorkspaceId" in data ||
                "existingWorkspaces" in data ||
                "runningWorkspacePrebuild" in data ||
                "runningPrebuildWorkspaceID" in data));
    }
    WorkspaceCreationResult.is = is;
})(WorkspaceCreationResult || (exports.WorkspaceCreationResult = WorkspaceCreationResult = {}));
var AuthProviderEntry;
(function (AuthProviderEntry) {
    function redact(entry) {
        return {
            ...entry,
            oauth: {
                ...entry.oauth,
                clientSecret: "redacted",
            },
        };
    }
    AuthProviderEntry.redact = redact;
})(AuthProviderEntry || (exports.AuthProviderEntry = AuthProviderEntry = {}));
//# sourceMappingURL=protocol.js.map