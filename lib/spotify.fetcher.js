import Spotify from './spotify'
import axios from 'axios'

const spotifyInstance = axios.create()

import createAuthRefreshInterceptor from 'axios-auth-refresh'

const refreshAuthLogic = failedRequest =>
  axios.get('/api/spotify/refresh').then(tokenRefreshResponse => {
    failedRequest.response.config.headers['Authorization'] =
      'Bearer ' + tokenRefreshResponse.data.accessToken
    return Promise.resolve()
  })

createAuthRefreshInterceptor(spotifyInstance, refreshAuthLogic)

export default function spotifyFetcher(endpoint) {
  return spotifyInstance({ method: 'GET', url: endpoint }).then(res => res.data)
}
