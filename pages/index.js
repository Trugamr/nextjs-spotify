import { signIn, signOut, getSession } from 'next-auth/client'
import Link from 'next/link'

export const getServerSideProps = async ({ req }) => {
  const session = await getSession({ req })
  return { props: { session } }
}

const Home = ({ session }) => {
  return (
    <div className="container">
      <h1>Hello {session ? session.user.name : ''} 👋</h1>
      {!session && (
        <>
          Not signed in <br />
          <button onClick={() => signIn('spotify')}>Sign In</button>
        </>
      )}

      {session && (
        <>
          Signed in as {session.user?.email} <br />
          <button onClick={signOut}>Sign Out</button> <br /> <br />
          <Link href="/playing">
            <a>see now playing &rarr;</a>
          </Link>
        </>
      )}
    </div>
  )
}

export default Home
