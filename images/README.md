# Web Image Proxy - Handle CORS from Dart applications

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

Add a reference to an image file available over HTTP/HTTPS.
```bash
DEFAULT_IMAGE="HTTPS://PATH_TO_IMAGE_FILE"
```

Confirm the DEFAULT_IMAGE environment variable has been populated
```bash
echo $DEFAULT_IMAGE
```

Deploy the image-web-proxy using Cloud Run.
Added environment variable to override the default image.
```bash
gcloud beta run deploy image-web-proxy --image gcr.io/$GOOGLE_CLOUD_PROJECT/image-web-proxy --platform managed --region us-central1 --allow-unauthenticated --set-env-vars "DEFAULT_IMAGE=$IMAGE_LOGO"
```

## Test

Test against a CORS impacted image.
A custom image for the value provided should be rendered in the browser.

### Test default image

Open a browser and add the endpoint

```
https://[ENDPOINT]
```

### Test custom image

Open a browser and add the endpoint
```
https://[ENDPOINT]?imageUrl=[CUSTOM_IMAGE_URL]
```








