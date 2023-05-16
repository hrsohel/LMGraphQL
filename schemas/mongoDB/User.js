import mongoose from "mongoose";

let User;

if (mongoose.models.User) {
  User = mongoose.model("User");
} else {
  const Schema = new mongoose.Schema({
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    issuedBooks: {
      type: [{
        books: {type: String, trim: true},
        requestedDate: {type: Date}
      }],
      default: []
    },
    requestBooks: {
      type: [{
        books: {type: String, trim: true},
        requestedDate: {type: Date}
      }],
      default: []
    }
  });

  User = mongoose.model("User", Schema);
}

export default User;