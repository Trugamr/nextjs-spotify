import { User, Account } from './models'
import mongoose from 'mongoose'

const { DATABASE_URL } = process.env

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  } catch (err) {
    throw err
  }
}

export const getAccountFromEmail = async email => {
  try {
    await connectMongoDB()
  } catch (err) {
    console.log(err)
    throw new Error('Failed to connect to database.')
  }

  try {
    const userInfo = await User.findOne({
      email
    })

    const accountInfo = await Account.findOne({
      userId: userInfo._id
    })

    if (accountInfo) return accountInfo
    else throw new Error("Couldn't find account info for specified email.")
  } catch (error) {
    console.log(error)
    throw new Error("Failed to get user's account from database.")
  } finally {
    // If connected disconnect
    if (mongoose.connection.readyState == 1) mongoose.disconnect()
  }
}
