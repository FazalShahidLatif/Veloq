'use strict';

module.exports = {
    database: {
        host: 'your_database_host',
        port: 5432, // default PostgreSQL port
        user: 'your_database_user',
        password: 'your_database_password',
        name: 'your_database_name'
    },
    aws: {
        accessKeyId: 'your_access_key',
        secretAccessKey: 'your_secret_key',
        region: 'your_region',
        s3: {
            bucket: 'your_bucket_name',
            endpoint: 'your_s3_endpoint'
        }
    },
    payment: {
        stripe: {
            secretKey: 'your_stripe_secret_key'
        }
    },
    server: {
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || 'development'
    },
    storage: {
        type: 'local', // or 'cloud' based on your setup
        path: 'path/to/storage'
    },
    logging: {
        level: 'info', // or 'debug', 'warn', etc.
        filePath: 'path/to/logfile.log'
    },
    aiService: {
        apiKey: 'your_ai_service_api_key',
        endpoint: 'https://your-ai-service.endpoint'
    },
    pricingRules: {
        defaultCurrency: 'USD',
        taxRate: 0.07 // Example tax rate
    },
    templateConfig: {
        emailTemplatePath: 'path/to/email/templates'
    },
    featureFlags: {
        newFeatureX: true,
        betaFeatureY: false
    }
};
