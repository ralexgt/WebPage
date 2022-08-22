import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
});

const Account = mongoose.model("Account", AccountSchema);

export default Account;