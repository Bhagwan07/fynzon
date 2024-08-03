const router = require("express").Router();
const { body } = require("express-validator");

const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserProfile,
} = require("../controllers/userAuthController");
const {
  checkUserLoginAttempts,
} = require("../middlewares/user/checkUserLoginAttempts");
const { verifyUserToken } = require("../middlewares/user/verifyUserToken");
const { uploadImage } = require("../utils/aws");

const registerUserBodyValidator = [
  body("firstName").notEmpty().withMessage("First name is missing"),
  body("lastName").notEmpty().withMessage("Last name is missing"),
  body("email")
    .notEmpty()
    .trim()
    .withMessage("Email id is missing")
    .isEmail()
    .withMessage("Invalid email id")
    .toLowerCase(),
  body("password")
    .notEmpty()
    .trim()
    .withMessage("Password is missing")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .custom((value) => {
      const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]\\|:;'<>,.?/])[a-zA-Z\d!@#$%^&*()_\-+={}[\]\\|:;'<>,.?/]{8,}$/;
      if (!regex.test(value)) {
        throw new Error(
          "Password must contain at least one uppercase letter, one lowercase letter, one special character and one number"
        );
      } else {
        return true;
      }
    }),
  body("profileImage").custom((val, { req }) => {
    if (!req.file) {
      throw new Error("Profile image is missing");
    }
    return true;
  }),
];

const loginUserBodyValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is missing")
    .isEmail()
    .withMessage("Invalid email id"),
  body("password").notEmpty().trim().withMessage("Password is missing"),
];

router
  .post(
    "/api/v1/registration",
    uploadImage.single("profileImage"),
    registerUserBodyValidator,
    registerUser
  )
  .post(
    "/api/v1/login",
    loginUserBodyValidator,
    checkUserLoginAttempts,
    loginUser
  )
  .get("/api/v1/get-all-users", verifyUserToken, getAllUsers)
  .get("/api/v1/get-user-profile", verifyUserToken, getUserProfile);

module.exports = router;
