const { chatModel } = require("../models/chatModel");

exports.createChat = (data) => {
  return chatModel.create(data);
};

exports.updateChatByFilter = (filter, updateObj, options) => {
  return chatModel.findOneAndUpdate(filter, updateObj, options);
};

exports.getChatByFilter = (filter = {}, projections = null, options = {}) => {
  return chatModel.findOne(filter, projections, options);
};
exports.updateChatById = (id = null, updateObj = {}, options = {}) => {
  return chatModel.findByIdAndUpdate(id, updateObj, options);
};
