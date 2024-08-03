const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      trim: true,
      required: true,
    },
    last_name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Email is required field"],
      unique: [true, "Email must be unique"],
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password is required field"],
    },
    token: {
      type: String,
      required: [true, "Token is required field"],
    },
    loginCount: {
      type: Number,
      default: 0,
    },
    isLoginAttemptExceeded: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    profile_image: {
      type: String,
      required: [true, "Profile image is required field"],
    },
    date: {
      type: Number,
      default: new Date().getTime(),
    },
  },
  { timestamps: true, versionKey: false }
);

// Hash the password before saving to db
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password with hashed password in database
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// Increment login count when user logs in
userSchema.methods.incrementLoginCount = function () {
  this.loginCount += 1;
  return this.save();
};

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.USER_JWT_SECRET, {
    expiresIn: process.env.USER_JWT_EXPIRES_IN,
    ignoreExpiration: false,
  });
  return token;
};

const userModel = mongoose.model("User", userSchema);
module.exports = { userModel };
