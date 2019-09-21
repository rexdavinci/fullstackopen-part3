const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const PORT = process.env.PORT || 3001

morgan.token('body', request=>{
  return request.method === 'POST' ? JSON.stringify(request.body) : ''
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
  ]

app.get('/api/persons', (request, response)=>{
  response.status(200).json(persons)
})

app.get('/api/persons/:id', (request, response)=>{
  const person = persons.find(person=>person.id == request.params.id)
  response.status(200).json(person)
})

app.delete('/api/persons/:id', (request, response)=>{
  const personId = Number(request.params.id)
  persons = persons.filter(person=> person.id !== personId)
  response.status(204).end()
})

app.post('/api/persons', (request, response)=>{
  const {body} = request

  const nameExists = persons.find(person=>person.name===body.name)
  if(nameExists){
    return response.status(400).json({
      error: 'name must be unique'
    })
  } else if(!body.number){
    return response.status(400).json({
      error: 'number missing'
    })
  }

  const newId = Math.random()*767102117845
  const newPerson = {
    name: body.name,
    number: body.number,
    id: newId
  }
  persons = persons.concat(newPerson) 
  response.status(201).json(newPerson)
})

app.get('/info', (request, response)=>{
  const timestamp = new Date()
  response.status(200).send(`<p>Phonebook has info for ${persons.length} people</p> <p>${timestamp}</p>`)
})

app.listen(PORT, ()=>{
  console.log(`Server listening at port ${PORT}`)
})