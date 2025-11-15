import { validateFileIDService } from '../services/extract.service.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const processImageData = asyncHandler(async (req, res) => {
  const { fileId } = req.body
  const userId = req.user.id
  const userEmail = req.user.email
  const orgId = req.user.organizationID
  const verifyFileId = await validateFileIDService(fileId)
  if (!verifyFileId) {
    throw new ApiError(400, 'Invalid fileId')
  }
})
