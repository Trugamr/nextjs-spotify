import { getSession } from 'next-auth/client'
import { getAccountFromEmail, connectMongoDB } from '../../../utils/mongo'
import { stringToBase64 } from '../../../utils/utils'
import axios from 'axios'
import qs from 'querystring'

const { SPOTIFY_ID, SPOTIFY_SECRET } = process.env

export default async (req, res) => {
  const session = await getSession({ req })
  const base64data = stringToBase64(`${SPOTIFY_ID}:${SPOTIFY_SECRET}`)

  // If user is not authenticated send unauthorized status
  if (!session?.user)
    return res.status(410).json({
      success: false,
      error: 'You need to be logged in to access this route.'
    })

  // Finding user's refresh token in database
  let accountInfo = null
  try {
    accountInfo = await getAccountFromEmail(session.user.email)
  } catch (err) {
    res.status(404).json({
      success: false,
      error: 'Failed to find user account info.'
    })
  }

  // Fetching new access token using user's refresh token
  let newAccessToken = null
  try {
    const response = await axios({
      method: 'POST',
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${base64data}`
      },
      data: qs.stringify({
        grant_type: 'refresh_token',
        refresh_token: accountInfo.refreshToken
      })
    })

    newAccessToken = response.data.access_token
  } catch (error) {
    const { status, data } = error.response
    return res.status(status).json({
      success: false,
      ...data
    })
  }

  // Updating accessToken in database
  try {
    const mongoClient = await connectMongoDB()
    await mongoClient
      .db('spotify')
      .collection('accounts')
      .updateOne(
        {
          _id: accountInfo._id
        },
        { $set: { accessToken: newAccessToken } }
      )
  } catch (error) {
    return res.json({
      success: false,
      errror: error.message
    })
  }

  res.json({
    success: true,
    accessToken: newAccessToken
  })
}
