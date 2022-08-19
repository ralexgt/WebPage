import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  logged_in:{
    type: Boolean,
    required: false,
  }
});

const Account = mongoose.model("Account", AccountSchema);

export default Account;