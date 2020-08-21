import Link from 'next/link'
import { getSession } from 'next-auth/client'
import axios from 'axios'
import useSWR from 'swr'

export const getServerSideProps = async ({ req }) => {
  const session = await getSession({ req })

  return {
    props: {
      session
    }
  }
}

const fetcher = url =>
  axios({
    method: 'GET',
    url
  }).then(res => res.data)

const logger = (url, fetcher) => {
  console.log(url)
  return fetcher(url)
}

const Playing = ({ session }) => {
  const { data, error } = useSWR('/api/spotify/currently-playing', arg =>
    logger(arg, fetcher)
  )
  if (!session)
    return (
      <div className="container">
        <h2>🔒 Login using spotify first.</h2>
      </div>
    )
  const playing = data?.data

  return (
    <div className="container">
      <h1>Playing</h1>

      {playing && (
        <div>
          <img
            style={{ width: 240 }}
            src={playing.item?.album?.images[0].url}
          />
          <p>{playing.item?.name}</p>
        </div>
      )}

      <Link href="/">
        <a>&larr; back to home</a>
      </Link>
    </div>
  )
}

export default Playing
