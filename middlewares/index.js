const { httpError } = require("../helpers/index");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(httpError(400, error.message));
    }

    return next();
  };
}

async function auth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer") {
    throw httpError(401, "Token type is not valid");
  }

  if (!token) {
    throw httpError(401, "No token provided");
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id);

    req.user = user;
    req.user.token = token;
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      throw httpError(401, "JsonWebToken is not valid");
    }
    throw error;
  }
  next();
}

module.exports = {
  validateBody,
  auth,
};
