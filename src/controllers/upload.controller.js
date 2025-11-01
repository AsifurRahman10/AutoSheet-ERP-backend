import { ApiError } from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { uploadImageOnCloud } from '../utils/fileUploader.js'

export const uploadImage = asyncHandler(async (req, res) => {
  const file = req.file
  if (!file) {
    throw new ApiError(400, 'Image file is required')
  }
  const imageLocalPath = file.path
  const upload = await uploadImageOnCloud(imageLocalPath)
  if (!upload || !upload.secure_url) throw new ApiError(500, 'Upload failed')
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { imageUrl: upload.url, publicKey: upload.public_id },
        'Image uploaded successfully'
      )
    )
})
