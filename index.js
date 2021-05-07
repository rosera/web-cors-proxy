const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors')
const PORT = process.env.PORT || 8080;
const BACKEND_ENDPOINT = process.env.ENDPOINT || 'local';
const app = express();

app.use(cors())
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Dart Functions Framework Proxy listening on port ${PORT}`);
});


async function postData(url, data) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'no-cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}


app.post('/', async (req, res) => {
  try {
    if (BACKEND_ENDPOINT.trim() === 'local') {
      //LOCALHOST: STUB entry	 
      res.status(200).json({"salutation":"Hello","name":"World"});
    } else {

      // CLOUD RUN BACKEND	  
      // req.body contains Flutter UI data: {"name":"World"})
      // Change the URL to match the backend-service used by Cloud RUN
      postData(BACKEND_ENDPOINT, data = req.body)
        .then(data => {
	   console.log(data);
	   return res.status(200).json(data);
      });
    }
  } catch (err) {
    console.log(`Error post: ${err}`);
  }

})
