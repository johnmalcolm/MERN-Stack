const express = require('express');

const app = express();
const proxy = require('http-proxy-middleware');
require('dotenv').config();

const port = process.env.UI_SERVER_PORT;
const { UI_API_ENDPOINT } = process.env;
const env = { UI_API_ENDPOINT };

const apiProxyTarget = process.env.API_PROXY_TARGET;
if (apiProxyTarget) {
  app.use('/graphql', proxy({ target: apiProxyTarget }));
}


app.use(express.static('public'));

app.get('/env.js', (req, res) => {
  res.send(`window.ENV = ${JSON.stringify(env)}`);
});

app.listen(port, () => {
  console.log(`UI server started on port ${port}`);
});
