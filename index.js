require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const PORT = process.env.PORT

morgan.token('body', request=>{
  return request.method === 'POST' ? JSON.stringify(request.body) : ''
})

const errorHandler = (error, request, response, next)=>{
  console.error(error.message)
  if(error.name === 'CastError' && error.kind === 'ObjectId'){
    return response.status(400).send({error: 'malformatted id'})
  } else if(error.name === 'ValidationError'){
    return response.status(400).json({error: error.message})
  }
  next(error)
}

app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

app.get('/api/persons', (request, response, next)=>{
  Person.find({}).then(persons=>{
    response.json(persons)
  }).catch(error=>next(error))
})

app.get('/api/persons/:id', (request, response, next)=>{
  Person.findById(request.params.id)
    .then(person=>{
      if(person){
        response.status(200).json(person.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error=>next(error))
})

app.post('/api/persons', (request, response, next)=>{
  const {body} = request
  if(!body.name){
    return response.status(400).json({
      error: '"name" property is missing for this entry'
    })
  }else if(!body.number){
    return response.status(400).json({
      error: ` 'number' property is missing for entry '${body.name}'`
    })
  }
  const newPerson = new Person({
    name: body.name,
    number: body.number,
  })
  newPerson
    .save()
    .then(savedPerson => savedPerson.toJSON())
    .then(savedJSONFormatPerson=>{
      response.status(201).json(savedJSONFormatPerson)
    })
    .catch(error=>next(error))
})

app.put('/api/persons/:id', (request, response, next)=>{
  const { body } = request
  const updatePerson ={
    name: body.name,
    number: body.number
  }
  Person.findOne({'name': body.name})
    .then(person=>{
      Person.findByIdAndUpdate(person.id, updatePerson, {new: true})
        .then(updatedPerson=>{
          response.json(updatedPerson.toJSON())
        })
        .catch(err=>next(err))
    })
    .catch(error=>next(error))
})


app.delete('/api/persons/:id', (request, response, next)=>{
  Person.findByIdAndDelete(request.params.id)
  .then(person=>{
    response.status(204).end()
  })
  .catch(error=>next(error))
})

app.get('/info', (request, response, next)=>{
  const timestamp = new Date()
  Person.find({}).then(persons=>{
    response.status(200).send(`<p>Phonebook has info for ${persons.length} people</p> <p>${timestamp}</p>`)
  })
  .catch(error=>next(error))
})


app.use(errorHandler)

app.listen(PORT, ()=>{
  console.log(`Server listening at port ${PORT}`)
})