import Link from 'next/link'
import { getSession } from 'next-auth/client'
import { getAccountFromEmail } from '../utils/mongo'
import useSWR from 'swr'
import Spotify from '../lib/spotify'

export const getServerSideProps = async ({ req }) => {
  const session = await getSession({ req })
  let accountInfo = null
  if (session) accountInfo = await getAccountFromEmail(session.user.email)

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

  if (error) return <h1>Error getting currently playing 😢</h1>

  return (
    <div className="container">
      <h1>{data?.is_playing ? 'Playing' : 'Paused'}</h1>

      {!data && !error && <h2>Loading</h2>}

      {data && (
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
