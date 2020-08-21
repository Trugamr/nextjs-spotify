import axios from 'axios'

class Spotify {
  accessToken = null
  spotifyPlayer = null

  constructor(accessToken) {
    this.accessToken = accessToken

    this.spotifyPlayer = axios.create({
      baseURL: 'https://api.spotify.com/v1/me/player',
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      }
    })
  }

  currentlyPlaying = async () => {
    try {
      const res = await this.spotifyPlayer({
        method: 'GET',
        url: '/currently-playing'
      })

      return res.data
    } catch (err) {
      console.log(err.response)
      throw err
    }
  }
}

export default Spotify
