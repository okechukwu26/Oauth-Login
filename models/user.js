const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  googleId: String,
  email: {
    type: String,
    unique: true,
  },
  thumbnail: String,
});

module.exports = mongoose.model("User", UserSchema);
