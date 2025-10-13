// packages/express-backend/models/user-services.js
import mongoose from "mongoose";
import userModel from "./user.js";

mongoose.set("debug", true);

// Use ENV if provided; otherwise the starter's local default
const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/users";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));

// Returns a thenable (Mongoose Query/Promise)
function getUsers(name, job) {
  let promise;
  if (name === undefined && job === undefined) {
    promise = userModel.find();
  } else if (name && job) {
    // IA4 requirement: match BOTH
    promise = userModel.find({ name: name, job: job });
  } else if (name && !job) {
    promise = findUserByName(name);
  } else if (job && !name) {
    promise = findUserByJob(job);
  }
  return promise;
}

function findUserById(id) {
  return userModel.findById(id);
}

function addUser(user) {
  const userToAdd = new userModel(user);
  const promise = userToAdd.save();
  return promise;
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
