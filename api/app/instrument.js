'use strict';
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');

const sdk = new NodeSDK({
    traceExporter: new OTLPTraceExporter({
        url: 'http://localhost:4318/v1/traces', // or use your EC2 private IP
    }),
    metricExporter: new OTLPMetricExporter({
        url: 'http://localhost:4318/v1/metrics',
    }),
    instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
console.log('OpenTelemetry initialized for API service');
