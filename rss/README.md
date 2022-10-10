# Web RSS Proxy - Handle CORS from Dart applications

## Overview

A quick hack to resolve a `cors` header issue faced with an early version of the `Dart Functions Framework`.
The general idea is that this app creates a proxy to capture the response from the backend service.
Any response will then be given an updated header to enable any origin to consume the data published.

The proxy is built using NodeJS using the `cors` library. 
The application will fetch against an ENDPOINT and add a header using the `cors` library.
Doing the above should enable any application outside of the `ORIGIN` to access information. 

The example uses `Cloud Run`, Google Clouds Serverless platform.
However the application can be run on any platform supporting `NodeJS`.

## Build Process

Build the image and post the entry to container registry
```bash
gcloud builds submit --config cloudbuild.yaml
```

Get the backend service endpoint - update the index.js file to include the value.
```bash
backend_service=$(gcloud run services list --platform managed --format='value(URL)' --filter='backend-service')
```

Confirm the backend_service environment variable has been populated
```bash
echo $backend_service
```

Deploy the rss-web-proxy using Cloud Run.
Added environment variable to set the Dart Framework Service endpoint.
```bash
gcloud beta run deploy rss-web-proxy --image gcr.io/$GOOGLE_CLOUD_PROJECT/rss-web-proxy --platform managed --region us-central1 --allow-unauthenticated --set-env-vars "ENDPOINT=$backend_service"
```

