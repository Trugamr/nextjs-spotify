import mongoose, { Schema } from 'mongoose'

// User and Account models
const userSchema = new Schema({
  name: String,
  mail: String,
  image: String,
  createdAt: Date,
  updatedAt: Date
})

export const User = (() => {
  try {
    return mongoose.model('user')
  } catch (err) {
    return mongoose.model('user', userSchema, 'users')
  }
})()

const accountSchema = new Schema({
  compoundId: String,
  userId: mongoose.Types.ObjectId,
  providerType: String,
  providerId: String,
  providerAccountId: String,
  refreshToken: String,
  accessToken: String,
  accessTokenExpires: Date,
  createdAt: Date,
  updatedAt: Date
})

export const Account = (() => {
  try {
    return mongoose.model('account')
  } catch (err) {
    return mongoose.model('account', accountSchema, 'accounts')
  }
})()
