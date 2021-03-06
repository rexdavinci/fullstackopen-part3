const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

mongoose.set('useFindAndModify', false)

const url = process.env.MONGODB_URI
console.log('connecting to mongoDB...')

mongoose.set('useCreateIndex', true)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(connected=>{
    console.log('connected to MongoDB')
  }).catch(error=>{
    console.log('error connecting to MOngoDB', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {type: String, unique:true, minlength: 3},
  number: {type: String, minlength: 8}
})


personSchema.set('toJSON', {
  transform: (document, returnedObject)=>{
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

personSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Person', personSchema)