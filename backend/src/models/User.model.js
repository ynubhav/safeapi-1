import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  usertype: { type:String, required: true, default:'User'},
  // For local signup (bcrypt hashed)
  password: { type: String },

  // OAuth linked accounts
  googleId: { type: String, default: null },
  githubId: { type: String, default: null },

  // For JWT refresh token flow
  refreshToken: { type: String, default: null },

  //projects 
  projects:[{ type: mongoose.Schema.Types.ObjectId, ref: "APIProject" }],

  // Audit info
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: null },
});

const User = mongoose.model("User", UserSchema);

export { User }