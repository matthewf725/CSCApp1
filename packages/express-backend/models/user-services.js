// packages/express-backend/models/user-services.js
import mongoose from "mongoose";
import userModel from "./user.js";

mongoose.set("debug", true);

mongoose
  .connect("mongodb://127.0.0.1:27017/users")
  .catch((error) => console.log(error));

function getUsers(name, job) {
  if (name === undefined && job === undefined) {
    return userModel.find();
  }
  if (name && job) {
    return userModel.find({ name: name, job: job });
  }
  if (name && !job) {
    return findUserByName(name);
  }
  if (job && !name) {
    return findUserByJob(job);
  }
  return userModel.find({ _id: { $exists: false } });
}

function findUserById(id) {
  return userModel.findById(id);
}

function addUser(user) {
  const userToAdd = new userModel(user);
  return userToAdd.save();
}

function deleteUserById(id) {
  return userModel.findByIdAndDelete(id);
}

function findUserByName(name) {
  return userModel.find({ name: name });
}

function findUserByJob(job) {
  return userModel.find({ job: job });
}

export default {
  addUser,
  getUsers,
  findUserById,
  findUserByName,
  findUserByJob,
  deleteUserById,
};
