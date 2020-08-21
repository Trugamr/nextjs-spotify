import { MongoClient } from 'mongodb'

const { DATABASE_URL } = process.env

export const connectMongoDB = async () => {
  const client = new MongoClient(DATABASE_URL, {
    useUnifiedTopology: true
  })
  try {
    await client.connect()
    return client
  } catch (err) {
    throw err
  }
}

export const getAccountFromEmail = async email => {
  let mongoClient
  try {
    mongoClient = await connectMongoDB()
  } catch (err) {
    console.log(err)
    throw new Error('Failed to connect to database.')
  }

  let accountInfo
  try {
    const userInfo = await mongoClient
      .db('spotify')
      .collection('users')
      .findOne({
        email
      })

    accountInfo = await mongoClient
      .db('spotify')
      .collection('accounts')
      .findOne({
        userId: userInfo._id
      })

    if (accountInfo) return accountInfo
    else throw new Error("Couldn't find account info for specified email.")
  } catch (error) {
    console.log(error)
    throw new Error("Failed to get user's account from database.")
  }
}
