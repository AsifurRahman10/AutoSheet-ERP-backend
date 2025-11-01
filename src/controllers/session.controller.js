import {
  getNewAccessToken,
  storeSessionCookies,
} from '../services/session.service.js'
import { ApiError } from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { supabase } from '../utils/supabaseClient.js'

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
  const oldRefreshToken = req.cookies.refresh_token
  if (!oldRefreshToken) {
    throw new ApiError(400, 'Refresh token is required')
  }

  // Use Supabase to refresh the session
  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: oldRefreshToken,
  })

  if (error || !data.session) {
    throw new ApiError(401, error?.message || 'Invalid refresh token')
  }

  const { access_token, refresh_token: newRefreshToken } = data.session

  // ✅ Update the HTTP-only cookie with the NEW refresh token
  await storeSessionCookies(newRefreshToken, res)

  // ✅ Send new access token to frontend
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { access_token },
        'Access token refreshed successfully'
      )
    )
})
