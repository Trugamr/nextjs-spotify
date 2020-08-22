import Link from 'next/link'
import { getSession } from 'next-auth/client'
import { getAccountFromEmail } from '../utils/mongo'
import useSWR from 'swr'
import Spotify from '../lib/spotify'

export const getServerSideProps = async ({ req }) => {
  const session = await getSession({ req })
  let accountInfo = null
  if (session) {
    try {
      accountInfo = await getAccountFromEmail(session.user.email)
    } catch (err) {
      console.log(`FAILED TO GET ACCOUNT INFO FOR ${session.user.name}`, err)
    }
  }

  return {
    props: {
      session:
        accountInfo && session
          ? {
              ...session,
              user: {
                ...session.user,
                accessToken: accountInfo.accessToken
              }
            }
          : null
    }
  }
}

const Playing = ({ session }) => {
  const spotify = new Spotify(session?.user?.accessToken)

  // Conditional fetching
  const { data, error } = useSWR(
    session ? 'currently-playing' : null,
    spotify.currentlyPlaying
  )

  if (!session)
    return (
      <div className="container">
        <h2>
          🔒 Login{' '}
          <Link href="/">
            <a style={{ textDecoration: 'underline' }}>here</a>
          </Link>{' '}
          using spotify first.
        </h2>
      </div>
    )

  if (error)
    return (
      <div className="container">
        <h1>Error getting currently playing 😢</h1>
      </div>
    )
  if (data === undefined && !error)
    return (
      <div className="container">
        {' '}
        <h2>Loading</h2>
      </div>
    )

  return (
    <div className="container">
      <h1>
        {data?.is_playing
          ? 'Playing'
          : data
          ? 'Paused'
          : "You aren't playing anything"}
      </h1>
      {data && data.item && (
        <div>
          <img style={{ width: 240 }} src={data.item?.album?.images[0].url} />
          <p>{data.item?.name}</p>
        </div>
      )}
      <Link href="/">
        <a>&larr; back to home</a>
      </Link>
    </div>
  )
}

export default Playing
