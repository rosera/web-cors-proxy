# Web Cors Proxy

## Overview

A quick hack to resolve the header issue with Dart Functions Framework
General idea, add a proxy to capture the response from the backend Dart service, add a header and then forward the response.
The proxy is built using NodeJS using the `cors` library. 
The application will fetch against an ENDPOINT and add a header using the cors library.
Doing the above should enable any application outside of the domain to access information. 


## Build Process

Build the image and post the entry to container registry
```
gcloud builds submit --config cloudbuild.yaml
```

Get the backend service endpoint - update the index.js file to include the value.
```
backend_service=$(gcloud run services list --platform managed --format='value(URL)' --filter='backend-service')
```

Confirm the backend_service environment variable has been populated
```
echo $backend_service
```

Deploy the backend-proxy using Cloud Run
```
gcloud beta run deploy backend-proxy --image gcr.io/qwiklabs-gcp-00-c7b5e4b1ccdc/backend-proxy --platform managed --region us-central1 --allow-unauthenticated --set-env-vars "ENDPOINT=$backend_service"
```

Get the REMOTE  SERVICE ENDPOINT
```
backend_proxy=$(gcloud run services list --platform managed --format='value(URL)' --filter='backend-proxy')
```

Test the ENDPOINT
```
curl -X POST -H "content-type: application/json" -d '{ "name": "World" }' -i -w "\n" $backend_proxy
```

## OPTIONAL: Local deployment
If you deploy this hack locally, the app will use localhost where the ENDPOINT variable is not set


## Test the ENDPOINT
```
npm start
```

Test the response - uses a stub to just return some info

```
curl -X POST -H "content-type: application/json" -d '{ "name": "World" }' -i -w "\n" localhost:8080
```
