import {
  getNewAccessToken,
  storeSessionCookies,
} from '../services/session.service.js'
import { ApiError } from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const storeSession = asyncHandler(async (req, res) => {
  const { refresh_token } = req.body
  if (!refresh_token) {
    throw new ApiError(400, 'Refresh token is required')
  }
  await storeSessionCookies(refresh_token, res)
  res
    .status(200)
    .json(new ApiResponse(200, null, 'Session stored successfully'))
})

export const refreshSession = asyncHandler(async (req, res) => {
  const refresh_token = req.cookies.refresh_token
  if (!refresh_token) {
    throw new ApiError(400, 'Refresh token is required')
  }
  const newAccessToken = await getNewAccessToken(refresh_token)
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { access_token: newAccessToken },
        'Access token refreshed successfully'
      )
    )
})
