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

const getAllUsersService = async (email) => {
  const orgId = (
    await User.findOne({ email: email }).select('organizationID').lean()
  ).organizationID
  const users = await User.find({ organizationID: orgId }).lean()
  return users
}

export { createUserService, getAllUsersService }
