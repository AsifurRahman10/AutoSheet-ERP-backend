import { Schema, mongoose } from 'mongoose'

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ['admin', 'manager', 'staff'],
      default: 'staff',
    },
    // isActive: { type: Boolean, default: true },
    phoneNumber: { type: String },
    staffId: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    profilePicture: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
    designation: { type: String },
    organizationID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    creator_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

export const User = mongoose.model('User', UserSchema)
