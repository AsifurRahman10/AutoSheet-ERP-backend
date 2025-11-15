import {
  createUserService,
  getAllUsersService,
  getUserDataService,
} from '../services/user.service.js'
import { User } from '../models/user.models.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import ApiResponse from '../utils/ApiResponse.js'

const registerUser = asyncHandler(async (req, res) => {
  const userData = req.body
  const checkCreatorAccess = req.user.role === 'admin'
  if (!checkCreatorAccess) {
    throw new ApiError(
      403,
      'Forbidden: You do not have permission to create users'
    )
  }
  const creatorId = req.user._id
  const organizationID = req.user.organizationID

  const existingUser = await getUserDataService(userData.email)
  if (existingUser) {
    throw new ApiError(400, 'User with this email already exists')
  }
  const user = await createUserService({ userData, creatorId, organizationID })
  if (!user) {
    throw new ApiError(400, 'User registration failed')
  }
  // Registration logic here
  res.status(201).json(new ApiResponse(201, 'User registered successfully'))
})

const getAllUsers = asyncHandler(async (req, res) => {
  const { search = '', filter = {}, page = 1, limit = 8 } = req.query
  const orgId = req?.user?.organizationID
  const allUsers = await getAllUsersService(orgId, search, filter, page, limit)
  if (!allUsers && allUsers.length === 0) {
    throw new ApiError(404, 'No users found')
  }
  res
    .status(200)
    .json(new ApiResponse(200, allUsers, 'Users retrieved successfully'))
})

const getUserData = asyncHandler(async (req, res) => {
  const userId = req.params.id
  if (!userId) {
    throw new ApiError(404, 'User ID is required')
  }
  const user = await getUserDataService(userId)
  res
    .status(200)
    .json(new ApiResponse(200, user, 'User retrieved successfully'))
})

export { registerUser, getAllUsers, getUserData }
