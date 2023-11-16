const { Schema, model } = require("mongoose");
const { MongooseError } = require("../helpers");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set your name"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      index: true,
      unique: true,
    },
    password: {
      type: String,
      minLength: [6, "Password must be minimum of six symbols"],
      required: [true, "Set password for user"],
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true },
);

userSchema.post("save", MongooseError);

const User = model("user", userSchema);

module.exports = User;
