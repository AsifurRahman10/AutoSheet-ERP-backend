import { User } from '../models/user.models.js'

const createUserService = async ({ userData, creatorId, organizationID }) => {
  const createUser = await User.create({
    name: userData.name,
    email: userData.email,
    role: userData.role,
    phoneNumber: userData.phone,
    gender: userData.gender,
    designation: userData.designation,
    staffId: userData.staffId,
    profilePicture: userData.profilePicture,
    organizationID,
    creator_id: creatorId,
  })
  return createUser
}

const getAllUsersService = async (orgId, search, filter, page, limit) => {
  const searchText = search?.trim() || ''
  const roleFilter = filter?.trim() || ''

  const skip = (page - 1) * limit
  const query = { organizationID: orgId }

  // build a search query
  if (searchText) {
    query.$or = [
      { name: { $regex: searchText, $options: 'i' } },
      { staffId: { $regex: searchText, $options: 'i' } },
      { phoneNumber: { $regex: searchText, $options: 'i' } },
    ]
  }

  if (roleFilter) {
    query.role = roleFilter
  }
  const totalUsers = await User.countDocuments(query)
  const users = await User.find(query).skip(skip).limit(limit).lean()
  return {
    total: totalUsers,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(totalUsers / limit),
    data: users,
  }
}

const getUserDataService = async (userId) => {
  const user = await User.findById(userId).lean()
  if (!user) {
    throw new ApiError(404, 'User not found')
  }
  return user
}

export { createUserService, getAllUsersService, getUserDataService }
