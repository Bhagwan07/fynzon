const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const { AppError } = require("../utils/AppError");
const {
  createUser,
  getUserByFilter,
  updateUserByFilter,
  getAllUsersByfilter,
  getUserById,
} = require("../services/userAuthServices");
const { logger } = require("../utils/winstonLogger");
const { uploadPublicFile } = require("../utils/aws");

exports.registerUser = async (req, res, next) => {
  try {
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      throw new AppError(400, errors[0].msg || "Bad request");
    } else {
      const reqBody = Object.assign({}, req.body);
      const isUserExist = await getUserByFilter(
        { email: reqBody.email },
        "_id",
        { lean: true }
      );
      if (isUserExist) {
        throw new AppError(400, "User already exist");
      }

      // upload image
      const userName = `${reqBody.firstName}-${reqBody.lastName}`.toLowerCase();
      const imageUrl = await uploadPublicFile(req.file, userName, 7);
      if (imageUrl.error) {
        throw new AppError(400, imageUrl.message || "Failed to upload image");
      }
      // token
      const jwtToken = jwt.sign(
        { email: reqBody.email },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN,
        }
      );

      const user = await createUser({
        first_name: reqBody.firstName,
        last_name: reqBody.lastName,
        phone_code: reqBody.phoneCode,
        phone: reqBody.phone,
        email: reqBody.email,
        password: reqBody.password,
        token: jwtToken,
        profile_image: imageUrl?.data || "",
      });

      res.status(201).json({
        message: "User registration completed successfully",
        error: false,
        data: user,
      });
    }
  } catch (err) {
    logger.error(`Error in registerUser ==> ${err.message}`);
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      throw new AppError(400, errors[0].msg || "Bad request");
    } else {
      const reqBody = Object.assign({}, req.body);

      const jwtToken = jwt.sign(
        { email: reqBody.email },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN,
        }
      );

      const updatedToken = await updateUserByFilter(
        { email: reqBody.email },
        { token: jwtToken, isLoginAttemptExceeded: false, loginCount: 0 },
        { new: true }
      );

      if (!updatedToken) {
        throw new AppError(400, "Failed to update user token");
      }

      res.status(200).json({
        message: "User login successfully",
        error: false,
        data: {
          token: updatedToken.token,
          userId: updatedToken._id,
        },
      });
    }
  } catch (err) {
    logger.error(`Error in loginUser ==> ${err.message} `);
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      throw new AppError(400, errors[0].msg || "Bad request");
    } else {
      const searchText = req.query?.searchText
        ? new RegExp(req.query.searchText, "i")
        : null;
      const userId = new mongoose.Types.ObjectId(req.query.userId);

      const users = await getAllUsersByfilter(
        { ...(searchText && { first_name: searchText }), _id: { $ne: userId } },
        "_id first_name last_name email profile_image date",
        { lean: true }
      );

      if (!users) {
        throw new AppError(400, "Failed to get users details");
      }

      res.status(200).json({
        message: "User details fetched successfully",
        error: false,
        data: users,
      });
    }
  } catch (err) {
    logger.error(`Error in getAllUsers ==> ${err.message} `);
    next(err);
  }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await getUserById(
      req.userId,
      "_id first_name last_name profile_image email date",
      { lean: true }
    );
    if (!user) {
      throw new AppError(400, "Failed to get user profile");
    }

    res.status(200).json({
      message: "User profile fetched successfully",
      error: false,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};
