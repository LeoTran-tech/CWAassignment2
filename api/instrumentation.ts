// assi2/api/instrument.ts

// This file initializes OpenTelemetry so the API can automatically
// collect and send telemetry (traces + metrics) to the OTEL Collector

'use strict';
const { NodeSDK } = require('@opentelemetry/sdk-node'); // core SDK
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');
const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

// Define service metadata
const resource = new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'api-service', // name in Jaeger UI
    [SemanticResourceAttributes.SERVICE_NAMESPACE]: 'assi2',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: 'development',
});

// --- INITIALIZE OTEL SDK ---
const sdk = new NodeSDK({
    resource,

    // Trace exporter
    traceExporter: new OTLPTraceExporter({
        // OTEL Collector endpoint (inside Docker network) that receives traces from the API
        url: 'http://otel-collector:4318/v1/traces',
    }),

    // Metrics exporter
    metricReader: new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
            url: 'http://otel-collector:4318/v1/metrics',
        }),
    }),

    // Auto instrumentation, this automatically tracks HTTP requests
    instrumentations: [getNodeAutoInstrumentations()],
});


// --- START SDK ---
try {
    sdk.start(); // activate telemetry collection
    console.log('OpenTelemetry initialized for API service');
} catch (error) {
    console.error('Error initializing OpenTelemetry:', error);
}

// --- SHUTDOWN ---
// Graceful shutdown: flush remaining telemetry before the app exits
if (typeof process !== 'undefined' && process.on) {
    process.on('SIGTERM', () => sdk.shutdown()); // when container/app is stopped
    process.on('SIGINT', () => sdk.shutdown()); // when Ctrl + C
}
