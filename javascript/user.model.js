const mongoose = require("mongoose");

module.exports.User= (mongoose) => {
  const userSchema = new mongoose.Schema({
    user_id: { type: Number, required: true },
    user_name: { type: String, required: true },
    back_accounts: [String],
    accounts: {
      bank: String,
      branch: String,
      address: String,
      city: String,
      district: String,
      state: String,
      bank_code: String,
      weather: {
        temp: Number,
        humidity: Number,
      },
    },
  });

  return mongoose.model("User", userSchema);
};
