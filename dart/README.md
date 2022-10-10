# Web Cors Proxy

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

Deploy the backend-proxy using Cloud Run.
Added environment variable to set the Dart Framework Service endpoint.
```bash
gcloud beta run deploy backend-proxy --image gcr.io/$GOOGLE_CLOUD_PROJECT/backend-proxy --platform managed --region us-central1 --allow-unauthenticated --set-env-vars "ENDPOINT=$backend_service"
```

Get the REMOTE SERVICE ENDPOINT
```bash
backend_proxy=$(gcloud run services list --platform managed --format='value(URL)' --filter='backend-proxy')
```

Test the SERVICE ENDPOINT
```bash
curl -X POST -H "content-type: application/json" -d '{ "name": "World" }' -i -w "\n" $backend_service
```

Reponse Output
```yaml
HTTP/2 200
x-frame-options: SAMEORIGIN
content-type: application/json
x-xss-protection: 1; mode=block
x-content-type-options: nosniff
x-cloud-trace-context: a8b66a66f74b5e18e7b4cbef6b82df96;o=1
date: Fri, 07 May 2021 11:33:05 GMT
server: Google Frontend
content-length: 37

{"salutation":"Aloha","name":"World"}
```

__NOTE:__ The x-frame-options is set to SAMEORIGIN. 


Test the PROXY ENDPOINT
```bash
curl -X POST -H "content-type: application/json" -d '{ "name": "World" }' -i -w "\n" $backend_proxy
```

Response Output
```yaml
HTTP/2 200
x-powered-by: Express
access-control-allow-origin: *
content-type: application/json; charset=utf-8
etag: W/"25-R5oQVqxFmOOOvhzVMaAlr31/xE4"
x-cloud-trace-context: a23183e5b3295cd60e7e856cf8dc6c77;o=1
date: Fri, 07 May 2021 11:48:39 GMT
server: Google Frontend
content-length: 37

{"salutation":"Hello","name":"World"}
```

__NOTE:__ The access-control-allow-origin is set to * (i.e. wildcard). 

## OPTIONAL: Local deployment
If you deploy this hack locally, the app will use localhost where the ENDPOINT variable is not set


## Test the ENDPOINT

Local testing optional setup. 
If a backend service is not provided as an environment variable, the setup defaults to localhost.

Install the necessary packages
```bash
npm i
```

Run the application - default port TCP:8080
```bash
npm start
```

Test the response - uses a stub to just return some info

```bash
curl -X POST -H "content-type: application/json" -d '{ "name": "World" }' -i -w "\n" localhost:8080
```
