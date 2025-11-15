import { File } from '../models/file.models.js'

export const saveFileToDbService = async (fileData) => {
  const doc = await File.create(fileData)
  return {
    _id: doc._id,
    secure_url: doc.secure_url,
    cloudinary_public_id: doc.cloudinary_public_id,
    createdAt: doc.createdAt,
  }
}
