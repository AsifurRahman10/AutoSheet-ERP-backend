import {
  createUserService,
  getAllUsersService,
} from '../services/user.service.js'
import { User } from '../models/user.models.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import ApiResponse from '../utils/ApiResponse.js'

const registerUser = asyncHandler(async (req, res) => {
  const userData = req.body
  const creator = userData.creator
  const checkCreatorAccess = await User.findOne({ email: creator })
  const creatorId = checkCreatorAccess ? checkCreatorAccess._id : null
  const organizationID = checkCreatorAccess
    ? checkCreatorAccess.organizationID
    : null
  if (
    !checkCreatorAccess ||
    (checkCreatorAccess.role !== 'admin' &&
      checkCreatorAccess.role !== 'manager')
  ) {
    throw new ApiError(
      403,
      'Forbidden: You do not have permission to create users'
    )
  }

  const existingUser = await User.findOne({ email: userData.email })
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
  const userEmail = req?.user?.user?.email
  const allUsers = await getAllUsersService(
    userEmail,
    search,
    filter,
    page,
    limit
  )
  if (!allUsers && allUsers.length === 0) {
    throw new ApiError(404, 'No users found')
  }
  res
    .status(200)
    .json(new ApiResponse(200, allUsers, 'Users retrieved successfully'))
})

export { registerUser, getAllUsers }
