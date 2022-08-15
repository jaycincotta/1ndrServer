# Based on Express.js on Netlify Example at https://github.com/neverendingqs/netlify-express

An example of how to host an Express.js app on Netlify using
[serverless-http](https://github.com/dougmoscrop/serverless-http). See
[express/server.js](express/server.js) for details, or check it out at
https://netlify-express.netlify.com/!

[index.html](index.html) simply loads html from the Express.js app using `<object>`, and the
app is hosted at `/.netlify/functions/server`. Examples of how to access the
Express.js endpoints:

```sh
TBD
This is what we started with
curl https://netlify-express.netlify.com/.netlify/functions/server
curl https://netlify-express.netlify.com/.netlify/functions/server/another
curl --header "Content-Type: application/json" --request POST --data '{"json":"POST"}' https://netlify-express.netlify.com/.netlify/functions/server
```

Use the following command to test locally:
ntl dev
