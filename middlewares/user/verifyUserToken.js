const { validationResult } = require("express-validator");
const { AppError } = require("../../utils/AppError");
const { verifyJwtToken } = require("../../shared/verifyJwtToken");
const { getUserByFilter } = require("../../services/userAuthServices");

exports.verifyUserToken = async (req, res, next) => {
  try {
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      throw new AppError(400, errors[0].msg || "Inavlid Input");
    } else {
      const token = req.headers["authorization"].split(" ")[1];
      if (!token) {
        throw new AppError(400, "Token is missing in headers");
      }

      //verify token
      const tokenData = await verifyJwtToken(token);
      if (tokenData.error) {
        throw new AppError(400, tokenData.message);
      }

      //parse user based on token
      const userResult = await getUserByFilter(
        { email: tokenData.data.email },
        "_id email first_name last_name isBlocked",
        {
          lean: true,
        }
      );

      if (!userResult) {
        throw new AppError(400, "INVALID TOKEN");
      }

      req.userId = userResult._id;
      req.email = userResult.email;
      req.firstName = userResult.first_name;
      req.lastName = userResult.last_name;
      next();
    }
  } catch (err) {
    next(err);
  }
};
