import { ApiError } from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { uploadImageOnCloud } from '../utils/fileUploader.js'
import { saveFileToDbService } from '../services/upload.service.js'

export const uploadImage = asyncHandler(async (req, res) => {
  const file = req.file
  if (!file) {
    throw new ApiError(400, 'Image file is required')
  }

  // --- validation
  const fileSize = file.size
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/tiff',
  ]

  if (
    !file.mimetype ||
    !allowedMimeTypes.includes(file.mimetype.toLowerCase())
  ) {
    // remove local temp file if present
    try {
      await fs.unlink(file.path)
    } catch (e) {
      /* ignore */
    }
    throw new ApiError(
      400,
      `Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`
    )
  }
  if (fileSize > maxSize) {
    try {
      await fs.unlink(file.path)
    } catch (e) {
      /* ignore */
    }
    throw new ApiError(400, 'File size exceeds the maximum limit of 10MB')
  }
  const uploader_id = req?.user?._id ?? null
  const uploader_email = req?.user?.email ?? null
  const orgId = req?.user?.organizationID ?? null
  const role = req?.user?.role ?? 'unknown'

  // If your app requires orgId, enforce it
  if (!orgId) {
    try {
      await fs.unlink(file.path)
    } catch (e) {
      /* ignore */
    }
    throw new ApiError(401, 'Missing organization context for uploader')
  }

  // --- upload to cloud
  let uploadResult
  try {
    uploadResult = await uploadImageOnCloud(file.path)
  } catch (err) {
    console.error('Cloud upload failed', err)
    // cleanup local file
    try {
      await fs.unlink(file.path)
    } catch (e) {
      /* ignore */
    }
    throw new ApiError(500, 'Upload failed')
  }

  // validate upload result
  if (!uploadResult || !uploadResult.secure_url || !uploadResult.public_id) {
    // attempt cleanup
    try {
      await fs.unlink(file.path)
    } catch (e) {
      /* ignore */
    }
    throw new ApiError(500, 'Upload failed: invalid cloud response')
  }

  // Build file metadata to persist (keep minimal)
  const fileData = {
    cloudinary_public_id: uploadResult.public_id,
    secure_url: uploadResult.secure_url,
    orgId,
    uploader_id,
    uploader_email,
    role,
    status: 'uploaded',
    original_name: file.originalname,
    mime: file.mimetype,
    size_bytes: fileSize,
  }

  // --- save to DB; on failure remove cloud resource to avoid orphan
  let saved
  try {
    saved = await saveFileToDbService(fileData) // must return the saved doc
  } catch (err) {
    console.error('DB save failed; cleaning cloud resource', err)
    try {
      await destroyFromCloud(uploadResult.public_id)
    } catch (destroyErr) {
      console.error('Failed to remove orphaned Cloudinary file', destroyErr)
    }
    // cleanup local file
    try {
      await fs.unlink(file.path)
    } catch (e) {
      /* ignore */
    }
    throw new ApiError(500, 'Failed to save file metadata')
  }

  // --- cleanup local temp file (best-effort)
  try {
    await fs.unlink(file.path)
  } catch (e) {
    // not fatal - log only
    console.warn('Failed to remove local temp file', e)
  }

  // --- Successful response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { publicKey: saved?.cloudinary_public_id, imageUrl: saved.secure_url },
        'Image uploaded successfully'
      )
    )
})
