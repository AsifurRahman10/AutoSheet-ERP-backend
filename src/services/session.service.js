import { supabase } from '../utils/supabaseClient.js'

export const storeSessionCookies = async (refresh_token, res) => {
  res.cookie('refresh_token', refresh_token, {
    httpOnly: true,
    secure: false, // must be false for localhost
    sameSite: 'Lax', // allows cross-origin requests from frontend port
    maxAge: 60 * 60 * 24 * 30 * 1000,
  })
}

export const getNewAccessToken = async (refresh_token) => {
  console.log(refresh_token)
  const { data, error } = await supabase.auth.refreshSession({ refresh_token })
  console.log(data)
  if (error) throw new Error(error.message)
  await storeSessionCookies(data.session.refresh_token, res)
  return data.session.access_token
}
