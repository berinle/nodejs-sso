var config = require("config");

const cfenv = require("cfenv");
const request = require("request-promise");

//pull cf env
const appEnv = cfenv.getAppEnv({ vcap: config.get("vcap") });
const services = appEnv.getService(config.get("sso").instanceName);

const { auth_domain, client_id, client_secret } = services.credentials;
const ISSUER = auth_domain || process.env.ISSUER;
const CLIENT_ID = client_id || process.env.CLIENT_ID;
const CLIENT_SECRET = client_secret || process.env.CLIENT_SECRET;
const SCOPE = config.get("sso").scope || process.env.SCOPE;

const buildAuthUrl = () => {
  //dynamically build implicit flow url
  const url =
    ISSUER +
    `/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&scope=${SCOPE}`;
  return url;
};

const getToken = async () => {
  const uri = buildAuthUrl();
  try {
    const res = await request.get(uri, {
      insecure: true,
      rejectUnauthorized: false
    });
    return res;
  } catch (e) {
    console.log(`ex: ${e}`);
    throw e;
  }
};

const verifyAccessToken = token => {
  //decode JWT and pass claims
};

const authMiddleware = async (req, res, next) => {
  console.log("intercept.");
  console.log(`req.path: ${req.path}`);
  if (!req.path.startsWith("/api/v1")) {
    return next();
  }

  const { authorization } = req.headers;
  if (!authorization) {
    const err = { message: "You must send an Authorization header." };
    return res.status(403).json(err);
  }

  const [authType, token] = authorization.trim().split(" ");
  if (authType !== "Bearer") {
    const err = { message: "Expected a Bearer token." };
    return res.status(403).json(err);
  }

  // verify claims...
  // const {claims} = await verifyAccessToken(token);
  // if (!claims.scp.includes(process.env.SCOPE)) {
  //     throw new Error('Could not verify the proper scope');
  // }
  // }

  next();
};

module.exports = {
  buildAuthUrl,
  authMiddleware,
  getToken
};
