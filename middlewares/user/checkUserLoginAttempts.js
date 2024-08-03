const { validationResult } = require("express-validator");

const {
  getUserByFilter,
  updateUserById,
} = require("../../services/userAuthServices");
const { AppError } = require("../../utils/AppError");
const { logger } = require("../../utils/winstonLogger");

exports.checkUserLoginAttempts = async (req, res, next) => {
  try {
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      throw new AppError(400, errors[0].msg || "Bad request");
    } else {
      const password = req.body.password;
      //check user exists or not
      const user = await getUserByFilter(
        { email: req.body.email },
        "_id isBlocked email password loginCount isLoginAttemptExceeded",
        {}
      );
      console.log(user);

      if (!user) {
        throw new AppError(400, "Invalid account");
      }

      if (user.isBlocked) {
        throw new AppError(400, "Unauthorised!");
      }

      //check login attempt exceeded or not
      if (user.isLoginAttemptExceeded) {
        return res.status(200).json({
          message: "Login attempts exceeded, reset the password to login",
          error: true,
          data: {
            is_login_attempt_exceeded: true,
          },
        });
      }

      // match the password
      const isPasswordMatched = await user.comparePassword(password);
      if (!isPasswordMatched) {
        await user.incrementLoginCount();

        // check login attempt
        if (user.loginCount >= 5) {
          const updatedUser = await updateUserById(
            user._id,
            { isLoginAttemptExceeded: true },
            { new: true }
          );

          if (!updatedUser) {
            throw new AppError(400, "Error in updating the user");
          }
        }

        throw new AppError(400, "Incorrect password");
      }

      req.user = user;
      next();
    }
  } catch (err) {
    logger.error(`Error in checkUserLoginAttempts ==> ${err.message}`);
    next(err);
  }
};
