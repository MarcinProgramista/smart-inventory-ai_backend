import jwt from "jsonwebtoken";

const jwtTokens = ({ id, name, email }) => {
  const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

  if (!ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET is missing");
  }

  if (!REFRESH_TOKEN_SECRET) {
    throw new Error("REFRESH_TOKEN_SECRET is missing");
  }

  const accessTokenPayload = {
    UserInfo: { id, name, email },
  };

  const refreshTokenPayload = {
    UserInfo: { id },
  };

  const commonOptions = {
    algorithm: "HS256",
    issuer: "smart-inventory-ai",
    audience: "smart-inventory-users",
  };

  const accessToken = jwt.sign(accessTokenPayload, ACCESS_TOKEN_SECRET, {
    ...commonOptions,
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(refreshTokenPayload, REFRESH_TOKEN_SECRET, {
    ...commonOptions,
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

export default jwtTokens;
