const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors')
const PORT = process.env.PORT || 8080;
const DEFAULT_IMAGE = process.env.DEFAULT_IMAGE ?? 'https://storage.googleapis.com/cmdlinezero.dev/public/images/cmdlinezero-logo.png';
const app = express();

// Enable CORS for all origins (adjust for specific origins if needed)
app.use(cors({
  origin: '*'
}));
app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const imageUrl = req.query.imageUrl ?? DEFAULT_IMAGE; // Get imageUrl from query parameter or use default

    const imageResponse = await fetch(imageUrl);

    if (!imageResponse.ok) {
      throw new Error(`Error fetching image: ${imageResponse.statusText}`);
    }

    // Check the image content type to ensure it's an image
    const contentType = imageResponse.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      throw new Error('Retrieved content is not an image');
    }

    // const imageData = await imageResponse.blob();
    const imageData = await imageResponse.buffer();

    // Set appropriate CORS headers for image response
    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust for specific origins if needed
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    res.status(200).send(imageData);
  } catch (err) {
    console.error(`Error fetching image: ${err}`);
    res.status(500).send('Error fetching image');
  }
});

app.listen(PORT, () => {
  console.log(`Image Proxy listening on port ${PORT}`);
});
