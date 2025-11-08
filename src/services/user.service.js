import { User } from '../models/user.models.js'

const createUserService = async ({ userData, creatorId, organizationID }) => {
  const createUser = await User.create({
    name: userData.name,
    email: userData.email,
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

const getAllUsersService = async (email, search, filter, page, limit) => {
  const searchText = search?.trim() || ''
  const roleFilter = filter?.trim() || ''
  const orgId = (
    await User.findOne({ email: email }).select('organizationID').lean()
  ).organizationID
  if (!orgId) {
    throw new ApiError(404, 'Organization not found')
  }
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
  console.log(users)
  return {
    total: totalUsers,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(totalUsers / limit),
    data: users,
  }
}

export { createUserService, getAllUsersService }
