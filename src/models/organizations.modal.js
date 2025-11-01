import { Schema, mongoose } from 'mongoose'

const OrganizationSchema = new Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
)

export const Organization = mongoose.model('Organization', OrganizationSchema)
