//https://developers.google.com/analytics/devguides/collection/protocol/v1/devguide
//https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters
//https://img.shields.io/badge/googleanalytics-github-green.svg

require('dotenv').config();
const request = require('requestretry');
const stream = require('stream');
const fs = require('fs');

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

module.exports = function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');

  if (req.query.repo) {

    const repo = req.query.repo;

    request({
      url: 'https://www.google-analytics.com/collect',
      json: false,
      method: 'POST',
      form: {
        v: '1',
        tid: process.env.PROPERTY_ID,
        cid: uuidv4(),
        t: 'pageview',
        dp: repo,
        uip: req.headers['x-forwarded-for'], //IP
        ua: req.headers['user-agent'] //user agent
      },
      // The below parameters are specific to request-retry
      maxAttempts: 5, // (default) try 5 times
      retryDelay: 5000, // (default) wait for 5s before trying again
      retryStrategy: request.RetryStrategies.HTTPOrNetworkError // (default) retry on 5xx or network errors
    }, function (err, response, body) {
      // this callback will only be called when the request succeeded or after maxAttempts or on error
      if (response) {


        const filename = req.query.empty === '' ? 'empty' : 'gag-green';
        fs.readFile(require('path').resolve(__dirname, `${filename}.svg`), 'utf-8', function (err, data) {
          context.res = {
            status: 200,
            headers: {
              'Content-Type': 'image/svg+xml' //SVG tutorial: https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Getting_Started
            },
            isRaw: true,
            body: data
          };
          context.done();
        });
      }
    });
  } else {
    context.res = {
      status: 400,
      body: "Please pass a repo on the query string"
    };
    context.done();
  }

};

//Azure Functions v2 will send output directly to response
//https://stackoverflow.com/questions/47614788/how-to-return-base64-image-from-azure-function-as-binary-data?rq=1
//more: https://stackoverflow.com/questions/43810082/azure-functions-nodejs-response-body-as-a-stream/43811778