import { User } from '../models/user.models.js'

const createUserService = async ({ userData, creatorId, organizationID }) => {
  const {
    fullName: name,
    email,
    phone: phoneNumber,
    gender,
    designation,
    staffId,
    profilePicture,
  } = userData
  console.log(userData)
  const createUser = await User.create({
    name,
    email,
    phoneNumber,
    gender,
    designation,
    staffId,
    profilePicture,
    organizationID,
    creator_id: creatorId,
  })
  console.log(createUser)
  return createUser
}

export { createUserService }
