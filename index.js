const express = require('express')
require('dotenv').config()
const Person = require('./models/PersonDB')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

morgan.token('content', function getContent (req) {
  return JSON.stringify({'name':req.body.name,'number':req.body.number})
})

app.use(morgan(':method :url :status :response-time ms :content'))



let notes = [
  { 
    'id': 1,
    'name': 'Arto Hellas', 
    'number': '040-123456'
  },
  { 
    'id': 2,
    'name': 'Ada Lovelace', 
    'number': '39-44-5323523'
  },
  { 
    'id': 3,
    'name': 'Dan Abramov', 
    'number': '12-43-234345'
  },
  { 
    'id': 4,
    'name': 'Mary Poppendieck', 
    'number': '39-23-6423122'
  }
]


app.get('/api/persons',(request,response,next)=>{
  Person.find({}).then((res)=>{
    response.json(res)
  }).catch((error)=>{
    next(error)
  })
})

app.get('/info',(request,response)=>{
  console.log(request.headers)
  response.send(`<p>phonebook has info for ${notes.length} people</p>
    <p>${new Date}</p>
    `)
})

app.get('/api/persons/:id',(request,response,next)=>{
  // const note = notes.find(n=>n.id===Number(request.params.id))
  // if(!note){
  //     response.status(404).end()
  // }
  // response.json(note)
  Person.findById(request.params.id).then((person)=>{
    response.json(person)
  }).catch((error)=>next(error))
})

app.delete('/api/persons/:id',(request,response,next)=>{
  Person.findByIdAndDelete(request.params.id).then(()=>{
    response.status(204).end()
  }).catch((error)=>{
    next(error)
  })
    
})

app.post('/api/persons',(request,response,next)=>{
  if(!request.body.name || !request.body.number){
    response.status(400).json({ 
      error: 'name or number missing' 
    })
  }
  const newPerson = new Person({
    name:request.body.name,
    number:request.body.number
  })
  newPerson.save().then(()=>{
    response.json(newPerson)
  }).catch((error)=>{
    console.log('the error body is:',error)
    next(error)
  })
})

app.put('/api/persons/:id',(request,response,next)=>{
  console.log(request.body)
  Person.findByIdAndUpdate(request.params.id,{'number':request.body.number}, { runValidators: true }).then(
    ()=>response.status(200).end()
  ).catch((error)=>next(error))
  
})

const errorHandler = (error,request,response,next) =>{
  console.error(error.message)
  console.log('error name is :',error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if(error.name ==='ValidationError'){
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
