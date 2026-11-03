"use strict";
/**
 * Copyright (c) 2021 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.newAnalyticsWriterFromEnv = newAnalyticsWriterFromEnv;
const Analytics = require("analytics-node");
const logging_1 = require("./logging");
function newAnalyticsWriterFromEnv() {
    switch (process.env.CODESTACK_ANALYTICS_WRITER) {
        case "segment":
            return new SegmentAnalyticsWriter(process.env.CODESTACK_ANALYTICS_SEGMENT_KEY || "", process.env.CODESTACK_ANALYTICS_SEGMENT_ENDPOINT || "");
        case "log":
            return new LogAnalyticsWriter();
        default:
            return new NoAnalyticsWriter();
    }
}
class SegmentAnalyticsWriter {
    constructor(writeKey, endpoint) {
        this.analytics = new Analytics(writeKey, {
            host: endpoint,
        });
    }
    identify(msg) {
        try {
            this.analytics.identify({
                ...msg,
                integrations: {
                    All: true,
                    Mixpanel: !!msg.userId,
                },
            }, (err) => {
                if (err) {
                    logging_1.log.warn("analytics.identify failed", err);
                }
            });
        }
        catch (err) {
            logging_1.log.warn("analytics.identify failed", err);
        }
    }
    track(msg) {
        try {
            this.analytics.track({
                ...msg,
                integrations: {
                    All: true,
                    Mixpanel: !!msg.userId,
                },
            }, (err) => {
                if (err) {
                    logging_1.log.warn("analytics.track failed", err);
                }
            });
        }
        catch (err) {
            logging_1.log.warn("analytics.track failed", err);
        }
    }
    page(msg) {
        try {
            this.analytics.page({
                ...msg,
                integrations: {
                    All: true,
                    Mixpanel: !!msg.userId,
                },
            }, (err) => {
                if (err) {
                    logging_1.log.warn("analytics.page failed", err);
                }
            });
        }
        catch (err) {
            logging_1.log.warn("analytics.page failed", err);
        }
    }
}
class LogAnalyticsWriter {
    identify(msg) {
        logging_1.log.debug("analytics identify", msg);
    }
    track(msg) {
        logging_1.log.debug("analytics track", msg);
    }
    page(msg) {
        logging_1.log.debug("analytics page", msg);
    }
}
class NoAnalyticsWriter {
    identify(msg) { }
    track(msg) { }
    page(msg) { }
}
//# sourceMappingURL=analytics.js.map