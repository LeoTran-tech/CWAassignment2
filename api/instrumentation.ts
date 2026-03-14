'use strict';
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');
const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

const resource = new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'api-service',
    [SemanticResourceAttributes.SERVICE_NAMESPACE]: 'assi2',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: 'development',
});

const sdk = new NodeSDK({
    resource,
    traceExporter: new OTLPTraceExporter({
        url: 'http://otel-collector:4318/v1/traces',
    }),
    metricReader: new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
            url: 'http://otel-collector:4318/v1/metrics',
        }),
    }),
    instrumentations: [getNodeAutoInstrumentations()],
});

try {
    sdk.start();
    console.log('OpenTelemetry initialized for API service');
} catch (error) {
    console.error('Error initializing OpenTelemetry:', error);
}

// Remove process.on for Edge Runtime
if (typeof process !== 'undefined' && process.on) {
    process.on('SIGTERM', () => sdk.shutdown());
    process.on('SIGINT', () => sdk.shutdown());
}
