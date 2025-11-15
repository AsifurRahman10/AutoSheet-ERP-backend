import { ApiError } from '../utils/ApiError.js'
import { supabase } from '../utils/supabaseClient.js'
import { User } from '../models/user.models.js'

const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      throw new ApiError(401, 'Authorization header missing')
    }

    const token = authHeader.split(' ')[1]
    const { data: user, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid or expired token' })
    }

    const mongoUser = await User.findOne({ supabase_uid: user.email })
      .select('_id organizationID role')
      .lean()

    req.user = {
      ...user.user,
      ...mongoUser,
    }
    next()
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

export default verifyAuth
