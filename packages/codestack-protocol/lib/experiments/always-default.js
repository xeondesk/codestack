"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newAlwaysReturningDefaultValueClient = newAlwaysReturningDefaultValueClient;
// AlwaysReturningDefaultValueClient is an implemention of an experiments.Client which performs no lookup/network operation
// and always returns the default value for a given experimentName.
// This client is used for non-SaaS version of Codestack, in particular for self-hosted installations where external
// network connections are not desirable or even possible.
class AlwaysReturningDefaultValueClient {
    getValueAsync(experimentName, defaultValue, attributes) {
        return Promise.resolve(defaultValue);
    }
    dispose() {
        // there is nothing to dispose, no-op.
    }
}
function newAlwaysReturningDefaultValueClient() {
    return new AlwaysReturningDefaultValueClient();
}
//# sourceMappingURL=always-default.js.map