"use strict";
/**
 * Copyright (c) 2021 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrometheusClientCallMetrics = void 0;
const inversify_1 = require("inversify");
const prometheusClient = __importStar(require("prom-client"));
let PrometheusClientCallMetrics = class PrometheusClientCallMetrics {
    constructor() {
        this.startedCounter = new prometheusClient.Counter({
            name: "grpc_client_started_total",
            help: "Total number of RPCs started on the client.",
            labelNames: ["grpc_service", "grpc_method", "grpc_type"],
            registers: [prometheusClient.register],
        });
        this.sentCounter = new prometheusClient.Counter({
            name: "grpc_client_msg_sent_total",
            help: " Total number of gRPC stream messages sent by the client.",
            labelNames: ["grpc_service", "grpc_method", "grpc_type"],
            registers: [prometheusClient.register],
        });
        this.receivedCounter = new prometheusClient.Counter({
            name: "grpc_client_msg_received_total",
            help: "Total number of RPC stream messages received by the client.",
            labelNames: ["grpc_service", "grpc_method", "grpc_type"],
            registers: [prometheusClient.register],
        });
        this.handledCounter = new prometheusClient.Counter({
            name: "grpc_client_handled_total",
            help: "Total number of RPCs completed by the client, regardless of success or failure.",
            labelNames: ["grpc_service", "grpc_method", "grpc_type", "grpc_code"],
            registers: [prometheusClient.register],
        });
        this.handledSecondsHistogram = new prometheusClient.Histogram({
            name: "grpc_client_handling_seconds",
            help: "Histogram of response latency (seconds) of the gRPC until it is finished by the application.",
            labelNames: ["grpc_service", "grpc_method", "grpc_type", "grpc_code"],
            registers: [prometheusClient.register],
        });
    }
    dispose() {
        prometheusClient.register.removeSingleMetric("grpc_client_started_total");
        prometheusClient.register.removeSingleMetric("grpc_client_msg_sent_total");
        prometheusClient.register.removeSingleMetric("grpc_client_msg_received_total");
        prometheusClient.register.removeSingleMetric("grpc_client_handled_total");
        prometheusClient.register.removeSingleMetric("grpc_client_handling_seconds");
    }
    started(labels) {
        this.startedCounter.inc({
            grpc_service: labels.service,
            grpc_method: labels.method,
            grpc_type: labels.type,
        });
    }
    sent(labels) {
        this.sentCounter.inc({
            grpc_service: labels.service,
            grpc_method: labels.method,
            grpc_type: labels.type,
        });
    }
    received(labels) {
        this.receivedCounter.inc({
            grpc_service: labels.service,
            grpc_method: labels.method,
            grpc_type: labels.type,
        });
    }
    handled(labels) {
        this.handledCounter.inc({
            grpc_service: labels.service,
            grpc_method: labels.method,
            grpc_type: labels.type,
            grpc_code: labels.code,
        });
    }
    startHandleTimer(labels) {
        return this.handledSecondsHistogram.startTimer({
            grpc_service: labels.service,
            grpc_method: labels.method,
            grpc_type: labels.type,
        });
    }
};
exports.PrometheusClientCallMetrics = PrometheusClientCallMetrics;
exports.PrometheusClientCallMetrics = PrometheusClientCallMetrics = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], PrometheusClientCallMetrics);
//# sourceMappingURL=client-call-metrics.js.map