import { File } from '../models/file.models.js'

const validateFileIDService = async (fileId) => {
  if (!fileId || typeof fileId !== 'string') {
    throw new Error('Invalid fileId')
  }
  const check = await File.findById(fileId)
  console.log(check)
  if (!check) {
    throw new Error('Invalid fileId')
  }
  return true
}
export { validateFileIDService }
