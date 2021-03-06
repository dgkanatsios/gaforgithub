require('dotenv').config();
const request = require('requestretry');
const fs = require('fs');

module.exports = function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');

  if (req.query.repo) {

    const cookies = parseCookies(req.headers.cookie);

    //see if there is a cookie with name GAGH
    if ('GAGH' in cookies) {
      sendResponse(context, req, cookies);
    } else {
      const cid = uuidv4(); //generate an anonymous client ID
      cookies.GAGH = cid;
      trackVisit(context, req, cid, cookies);
    }


  } else {
    context.res = {
      status: 400,
      body: "Please pass a repo on the query string"
    };
    context.done();
  }
};

function trackVisit(context, req, cid, cookies) {
  const repo = req.query.repo;
  let ip = "";
  if (req.headers["x-forwarded-for"]) {
    ip = req.headers["x-forwarded-for"].split(":")[0];
  }

  request({
    url: 'https://www.google-analytics.com/collect',
    json: false,
    method: 'POST',
    form: {
      v: '1',
      tid: process.env.PROPERTY_ID,
      cid: cid,
      t: 'pageview',
      dp: repo,
      //GitHub currently uses Camo, so all the below details are hidden unfortunately
      //listed here in case you want to use this in an environment other than GitHub
      //https://help.github.com/articles/about-anonymized-image-urls/
      dr: encodeURIComponent(req.headers['referer']), //referer
      uip: ip, //user's IP
      ua: req.headers['user-agent'] //user agent
    },
    // The below parameters are specific to request-retry
    maxAttempts: 5, // (default) try 5 times
    retryDelay: 5000, // (default) wait for 5s before trying again
    retryStrategy: request.RetryStrategies.HTTPOrNetworkError // (default) retry on 5xx or network errors
  }, function (err, response, body) {
    // this callback will only be called when the request succeeded or after maxAttempts or on error
    if (response) {
      sendResponse(context, req, cookies);
    }
  });
}

function sendResponse(context, req, cookies) {
  const filename = req.query.empty === '' ? 'empty' : 'gag-green';
  fs.readFile(require('path').resolve(__dirname, `${filename}.svg`), 'utf-8', function (err, data) {
    context.res = {
      status: 200,
      headers: {
        'Set-Cookie': stringifyCookies(cookies),
        'Content-Type': 'image/svg+xml', //SVG tutorial: https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Getting_Started
        'Cache-Control': 'private, no-store'
      },
      isRaw: true,
      body: data
    };
    context.done();
  });
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function parseCookies(cookie) {
  //this is a really simple method for cookie parsing found here https://stackoverflow.com/a/31645958/1205817
  //this may not work, however, for more 'weird' cookie values, e.g. if the cookie contains a ':'
  return (cookie && cookie.split(';').reduce(
    function (prev, curr) {
      var m = / *([^=]+)=(.*)/.exec(curr);
      var key = m[1];
      var value = decodeURIComponent(m[2]);
      prev[key] = value;
      return prev;
    }, {}
  )) || {};
}

function stringifyCookies(cookies) {
  var list = [];
  for (var key in cookies) {
    list.push(key + '=' + encodeURIComponent(cookies[key]));
  }
  return list.join('; ');
}

//GA documentation links and more
//https://developers.google.com/analytics/devguides/collection/protocol/v1/devguide
//https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters
//https://img.shields.io/badge/googleanalytics-github-green.svg


//Azure Functions v2 will send output directly to response
//https://stackoverflow.com/questions/47614788/how-to-return-base64-image-from-azure-function-as-binary-data?rq=1
//more: https://stackoverflow.com/questions/43810082/azure-functions-nodejs-response-body-as-a-stream/43811778