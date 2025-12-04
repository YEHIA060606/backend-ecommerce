// models/user.model.js
import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Email invalide",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // pour le projet on ne chiffre pas, c'est ok
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
  },
  {
    timestamps: true, // ajoute createdAt et updatedAt automatiquement
  }
);

const User = mongoose.model("User", userSchema);

export default User;
