import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

import mongooseHidden from 'mongoose-hidden'
import uniqueValidator from 'mongoose-unique-validator'

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(val){
        // eslint-disable-next-line no-useless-escape
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)
      },
      message: props => `${props.value} is not a valid email address.`
    } 
  },
  password: { 
    type: String, 
    required: true, 
    minlength: 6 
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  bio: { type: String },
  nationality: { type: String },
  countriesVisited: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Country' }],
  countriesWishList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Country' }],
  isTravelling: { type: Boolean },
  isPublic: { type: Boolean },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  sentRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  receivedRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  languages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Language' }],
  profilePicture: { type: String },
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }]
})

userSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync())
  }
  next()
})

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.password)
}

userSchema.virtual('passwordConfirmation')
  .set(function setPasswordConfirmation(passwordConfirmation) {
    this._passwordConfirmation = passwordConfirmation
  })

userSchema
  .pre('validate', function checkPassword(next) {
    if (this.isModified('password') && (this.password !== this._passwordConfirmation)) {
      this.invalidate('passwordConfirmation', 'Should match password')
    }
    next()
  })

userSchema.plugin(uniqueValidator)
userSchema.plugin(mongooseHidden({ defaultHidden: {
  password: true,
  email: true
} }))

export default mongoose.model('User', userSchema)