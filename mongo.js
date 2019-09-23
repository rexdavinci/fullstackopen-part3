const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url =
  `mongodb+srv://fullstack:${password}@fullstackopen-upz1d.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)


const person = new Person({
  name: process.argv[3],
  number: process.argv[4]
})

if(process.argv.length === 3){
  console.log('phonebook:')
  Person.find({})
    .then(persons=>{
    persons.map(person=>{
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  }).catch(err=>console.error(err))
} else if ( (process.argv.length === 4)){
  person.save().then(response=>{
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  }).catch(err=>console.error(err))
}


