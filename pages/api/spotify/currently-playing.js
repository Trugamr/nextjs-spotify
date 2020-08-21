import { getSession } from 'next-auth/client'
import { getAccountFromEmail } from '../../../utils/mongo'
import Spotify from '../../../lib/spotify'

export default async (req, res) => {
  const session = await getSession({ req })
  if (!session?.user?.email)
    return res.status(401).json({
      success: false,
      error: 'You need to be logged in to use this endpoint.'
    })

  let accountInfo = null
  try {
    accountInfo = await getAccountFromEmail(session.user.email)
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Failed to get account info for specified email.'
    })
  }

  const spotify = new Spotify(accountInfo.accessToken)
  try {
    const currentlyPlaying = await spotify.currentlyPlaying()
    return res.json({
      success: true,
      data: currentlyPlaying
    })
  } catch (err) {
    if (err.response) {
      res.status(err.response.status).json({
        success: false,
        error: err.message
      })
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to get currently playing.'
      })
    }
  }
}
