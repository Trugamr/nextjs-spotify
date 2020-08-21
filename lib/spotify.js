import axios from 'axios'

import createAuthRefreshInterceptor from 'axios-auth-refresh'

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

    // Function that will be called to refresh authorization
    const refreshAuthLogic = failedRequest =>
      axios
        .get('/api/spotify/refresh')
        .then(tokenRefreshResponse => {
          this.accessToken = tokenRefreshResponse.data.accessToken
          console.log('ACCESS TOKEN REFRESH', this.accessToken)

          this.spotifyPlayer.defaults.headers[
            'Authorization'
          ] = `Bearer ${this.accessToken}`

          failedRequest.response.config.headers[
            'Authorization'
          ] = `Bearer ${this.accessToken}`
          return Promise.resolve()
        })
        .catch(err => console.log('ERROR', err))

    // Instantiate the interceptor
    createAuthRefreshInterceptor(this.spotifyPlayer, refreshAuthLogic)
  }

  currentlyPlaying = () =>
    this.spotifyPlayer({
      method: 'GET',
      url: '/currently-playing'
    })
      .then(res => res.data)
      .catch(err => {
        console.log('lib', err.response)
        throw err
      })
}

export default Spotify
