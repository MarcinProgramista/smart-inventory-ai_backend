import jwt from "jsonwebtoken";

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

// 🔐 Common JWT config
const jwtCommonOptions = {
  algorithm: "HS256",
  issuer: "smart-inventory-ai",
  audience: "smart-inventory-users",
};

// 🔍 Validate envs
if (!ACCESS_TOKEN_SECRET) {
  throw new Error("ACCESS_TOKEN_SECRET is missing");
}

if (!REFRESH_TOKEN_SECRET) {
  throw new Error("REFRESH_TOKEN_SECRET is missing");
}

// 🎟 Generate access + refresh tokens
const jwtTokens = ({ id, name, email }) => {
  const accessTokenPayload = {
    UserInfo: { id, name, email },
  };

  const refreshTokenPayload = {
    UserInfo: { id },
  };

  const accessToken = jwt.sign(accessTokenPayload, ACCESS_TOKEN_SECRET, {
    ...jwtCommonOptions,
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(refreshTokenPayload, REFRESH_TOKEN_SECRET, {
    ...jwtCommonOptions,
    expiresIn: "7d",
  });

  return {
    accessToken,
    refreshToken,
  };
};

// ✅ Verify refresh token
const verifyRefreshToken = (refreshToken, callback) => {
  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, jwtCommonOptions, callback);
};

const generateAccessToken = ({ id, name, email }) => {
  return jwt.sign(
    {
      UserInfo: {
        id,
        name,
        email,
      },
    },
    ACCESS_TOKEN_SECRET,
    {
      ...jwtCommonOptions,
      expiresIn: "15m",
    },
  );
};
export { jwtTokens, verifyRefreshToken, jwtCommonOptions, generateAccessToken };
