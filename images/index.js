const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors')
const PORT = process.env.PORT || 8080;
const BACKEND_ENDPOINT = process.env.ENDPOINT ?? 'https://storage.googleapis.com/roselabs-poc-images/tutorr/tutorr-images/ada_lovelace.jpeg';
const app = express();

app.use(cors())
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Image Proxy listening on port ${PORT}`);
});

app.get('/', async (req, res) => {
  try {
     getData(BACKEND_ENDPOINT)
        .then(data => {
	   console.log(data);
	   return res.status(200).send(data);
      });
  } catch (err) {
    console.log(`Error HTTP GET: ${err}`);
  }
});


async function getData(url) {
  console.log(url);
  const response = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'no-cors', // no-cors, *cors, same-origin
    headers: {
      'Content-Type': 'rss/png'
    },
  })
  
  return response.send();
}
