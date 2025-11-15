import mongoose from 'mongoose'

const fileSchema = new mongoose.Schema(
  {
    cloudinary_public_id: { type: String, required: true, index: true },
    secure_url: { type: String },
    orgId: { type: String, required: true, index: true },
    uploader_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    uploader_email: { type: String },
    role: { type: String },
    status: {
      type: String,
      enum: [
        'uploaded',
        'queued',
        'processing',
        'processed',
        'failed',
        'verified',
      ],
      default: 'uploaded',
      index: true,
    },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export const File = mongoose.model('File', fileSchema)
