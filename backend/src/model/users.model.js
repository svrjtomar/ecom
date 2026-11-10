import mongoose from "mongoose";

const schema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  refreshToken: String,
});

const User = mongoose.model("Users", schema);

export default User;
