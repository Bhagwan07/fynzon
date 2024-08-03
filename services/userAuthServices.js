const { userModel } = require("../models/userModel");

exports.createUser = (data) => {
  return userModel.create(data);
};

exports.getUserById = (id, projections = null, options = {}) => {
  return userModel.findById(id, projections, options);
};

exports.getUserByFilter = (filter = {}, projections = null, options = {}) => {
  return userModel.findOne(filter, projections, options);
};

exports.updateUserById = (id, updateObj = {}, options = {}) => {
  return userModel.findByIdAndUpdate(id, updateObj, options);
};

exports.updateUserByFilter = (filter = {}, updateObj = {}, options = {}) => {
  return userModel.findOneAndUpdate(filter, updateObj, options);
};

exports.getAllUsersByfilter = (
  filter = {},
  projections = null,
  options = {}
) => {
  return userModel.find(filter, projections, options);
};
