import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const options = {
  providers: [
    Providers.Spotify({
      clientId: process.env.SPOTIFY_ID,
      clientSecret: process.env.SPOTIFY_SECRET,
      scope:
        'user-read-email user-library-read user-read-currently-playing user-read-recently-played user-read-playback-state user-modify-playback-state'
    })
  ],

  database: process.env.DATABASE_URL
}

export default (req, res) => NextAuth(req, res, options)
