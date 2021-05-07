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

Get the REMOTE SERVICE ENDPOINT
```
backend_proxy=$(gcloud run services list --platform managed --format='value(URL)' --filter='backend-proxy')
```

Test the SERVICE ENDPOINT
```
curl -X POST -H "content-type: application/json" -d '{ "name": "World" }' -i -w "\n" $backend_service
```

Reponse Output
```
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
```
curl -X POST -H "content-type: application/json" -d '{ "name": "World" }' -i -w "\n" $backend_proxy
```

Response Output
```
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
```
npm start
```

Test the response - uses a stub to just return some info

```
curl -X POST -H "content-type: application/json" -d '{ "name": "World" }' -i -w "\n" localhost:8080
```
