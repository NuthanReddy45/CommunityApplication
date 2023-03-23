const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    // email , username, password, rooms[] , college,branch,date of creation,professor
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = Users = mongoose.model("users", UserSchema);