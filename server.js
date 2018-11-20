var config = require("config");
var path = __dirname + "/views/";
var rp = require("request-promise");
var btoa = require("btoa");

const { buildAuthUrl, authMiddleware, getToken } = require("./auth");

const express = require("express");
const cfenv = require("cfenv");
const router = express.Router();

const bodyParser = require("body-parser");
const appEnv = cfenv.getAppEnv({ vcap: config.get("vcap") });
const services = appEnv.getService(config.get("sso").instanceName);

const { auth_domain, client_id, client_secret } = services.credentials;
const ISSUER = auth_domain || process.env.ISSUER;
const CLIENT_ID = client_id || process.env.CLIENT_ID;
const CLIENT_SECRET = client_secret || process.env.CLIENT_SECRET;
const SCOPE = config.get("sso").scope || process.env.SCOPE;

const app = express();
const port = appEnv.port || 3000;

app.use(bodyParser.json());
// app.use(authMiddleware);

app.get("/", async (req, res) => {
  console.log(`here...`);
  const result = await getToken();
  return res.send(`<a href="${buildAuthUrl()}">View Profile</a>`);
  // res.sendFile(path + "index.html");
});

app.get("/protected", (req, res) => res.send("**** PROTECTED ****"));

app.post("/v1/login", async (req, res) => {
  return res.status(200).end();
});

app.get("/oauth/callback", async (req, res) => {
  console.log("** callback **");

  const authorization = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  const uri = `${ISSUER}/oauth/token?grant_type=authorization_code&code=${
    req.query.code
  }`;
  const myresponse = await rp.post(uri, {
    method: "POST",
    inseure: true,
    rejectUnauthorized: false,
    json: true,
    headers: {
      Authorization: `Basic ${authorization}`
    }
  });
  const { access_token, refresh_token, jti, scope, token_type } = myresponse;

  res.send("SUCCESS!");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
