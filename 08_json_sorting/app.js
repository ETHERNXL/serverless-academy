const axios = require('axios');

const endpoints = [
     // ... list of endpoint URLs ...
    'https://jsonbase.com/sls-team/json-793',
    'https://jsonbase.com/sls-team/json-955',
    'https://jsonbase.com/sls-team/json-231',
    'https://jsonbase.com/sls-team/json-931',
    'https://jsonbase.com/sls-team/json-93',
    'https://jsonbase.com/sls-team/json-342',
    'https://jsonbase.com/sls-team/json-770',
    'https://jsonbase.com/sls-team/json-491',
    'https://jsonbase.com/sls-team/json-281',
    'https://jsonbase.com/sls-team/json-718',
    'https://jsonbase.com/sls-team/json-310',
    'https://jsonbase.com/sls-team/json-806',
    'https://jsonbase.com/sls-team/json-469',
    'https://jsonbase.com/sls-team/json-258',
    'https://jsonbase.com/sls-team/json-516',
    'https://jsonbase.com/sls-team/json-79',
    'https://jsonbase.com/sls-team/json-706',
    'https://jsonbase.com/sls-team/json-521',
    'https://jsonbase.com/sls-team/json-350',
    'https://jsonbase.com/sls-team/json-64'
];

//Takes a URL and uses axios to make a GET to URL
async function fetchData(url) {
  try {
    const response = await axios.get(url);
    return response.data; // returns the response data
  } catch (error) {
    throw new Error(`[Fail] ${url}: The endpoint is unavailable`);
  }
}


//If failure try to GET response 3 more times
async function processEndpoints() {
  let trueCount = 0;
  let falseCount = 0;

  for (const endpoint of endpoints) {
    let retry = 0;
    let isDone = null;

    while (retry < 3) {
      try {
        const data = await fetchData(endpoint);
        isDone = data.isDone;
        break;
      } catch (error) {
        console.error(error.message);
        retry++;
      }
    }

    //Count true and false responses
    if (isDone !== null) {
      if (isDone) {
        trueCount++;
      } else {
        falseCount++;
      }
      console.log(`[Success] ${endpoint}: isDone - ${isDone}`);
    }
  }

  console.log(`\nFound True values: ${trueCount}`);
  console.log(`Found False values: ${falseCount}`);
}

processEndpoints();