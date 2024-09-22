import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "Please provide a username"],
      trim: true,
      unique: [true, "Username already exists"],
      lowercase: true,
      index: true,
    },
    firstName: {
      type: String,
      required: [true, "First name is rqeuired"],
      minlength: [5, "First name must be atlest 5 length"],
      lowercase: true,
      trim: true, // if the user give extra spacing it will automatic trim it
      maxlength: [20, "First name should be less then or equal 20 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is rqeuired"],
      minlength: [5, "Last name must be atlest 5 length"],
      lowercase: true,
      trim: true, // if the user give extra spacing it will automatic trim it
      maxlength: [20, "Last name should be less then or equal 20 characters"],
    },
    email: {
      type: String,
      trime: true,
      required: [true, "Email should be provided"],
      unique: [true, `email is already exist`],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    avatar: {
      type: String, // cloudinary url
      required: [true, "Please provide a avatar"],
    },
    coverImage: {
      type: String,
    },
    watchHistory: [
      {
      type: Schema.Types.ObjectId,
      ref: "Video",
    }
    ],
    password: {
      type: String,
      required: [true, "Password should be provided"],
      minlength: [6, `Password atleast 6 characters long`],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if(!this.isModified("password")) return next();
  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
  next();
});

const User = mongoose.model("User", userSchema); // colection

export default User;
