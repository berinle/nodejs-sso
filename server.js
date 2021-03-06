var config = require("config");
var path = __dirname + "/views/";

const { buildAuthUrl, authMiddleware, getToken } = require("./auth");

const express = require("express");
const cfenv = require("cfenv");
const router = express.Router();

const bodyParser = require("body-parser");

const app = express();
const appEnv = cfenv.getAppEnv({ vcap: config.get("vcap") });
const port = appEnv.port || 3000;

app.use(bodyParser.json());
app.use(authMiddleware);

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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
