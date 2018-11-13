// const OktaJwtVerifier = require('@okta/jwt-verifier');

const { ISSUER, CLIENT_ID, CLIENT_SECRET, SCOPE } = process.env;

// validate = async (req, res, next) => {
//     console.log(`validating...`);
// };

buildAuthUrl = () => {
  //dynamically build implicit flow url
  const url =
    ISSUER +
    `/oauth/authorize?client_id=${CLIENT_ID}&response_type=token&scope=${SCOPE}`;
  return url;
};

verifyAccessToken = token => {
  //decode JWT and pass claims
};

secureApi = async (req, res, next) => {
  try {
    console.log(`validating...`);

    console.log(`req.path => ${req.path}`);

    //todo: verify token

    if (
      !req.path.startsWith('/api/v1')
    ) {
      //   return res.status(200).end();
      next();
    }

    // if (req.path !== '/v1/login' || req.path !== '/home') {
    const { authorization } = req.headers;
    if (!authorization) {
      const err = { message: "You must send an Authorization header." };
      return res.status(403).json(err);
      //   throw new Error("You must send an Authorization header");
    }

    const [authType, token] = authorization.trim().split(" ");
    if (authType !== "Bearer") {
      const err = { message: "Expected a Bearer token." };
      return res.status(403).json(err);
      // throw new Error("Expected a Bearer token");
    }

    // verify claims...
    // const {claims} = await verifyAccessToken(token);
    // if (!claims.scp.includes(process.env.SCOPE)) {
    //     throw new Error('Could not verify the proper scope');
    // }
    // }
    next();
  } catch (error) {
    next(error.message);
  }
};

module.exports = {
  secureApi,
  buildAuthUrl
};
