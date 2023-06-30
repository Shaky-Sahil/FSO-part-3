const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())

morgan.token('content', function getContent (req) {
  return JSON.stringify({"name":req.body.name,"number":req.body.number})
})

app.use(morgan(':method :url :status :response-time ms :content'))

let notes = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons',(request,response)=>{
    response.json(notes)
})

app.get('/info',(request,response)=>{
    console.log(request.headers)
    response.send(`<p>phonebook has info for ${notes.length} people</p>
    <p>${new Date}</p>
    `)
})

app.get('/api/persons/:id',(request,response)=>{
    const note = notes.find(n=>n.id===Number(request.params.id))
    if(!note){
        response.status(404).end()
    }
    response.json(note)
})

app.delete('/api/persons/:id',(request,response)=>{
    const id = Number(request.params.id)
    notes = notes.filter(n=>n.id!== id)

    response.status(204).end()
})

app.post('/api/persons',(request,response)=>{
    const id = Math.floor(Math.random()*1000)
    if(!request.body.name || !request.body.number){
        response.status(400).json({ 
            error: 'name or number missing' 
          })
    }
    if(notes.find(n=>n.name===request.body.name)){
        response.status(400).json({ 
            error: 'name already exists' 
          })
    }
    
    const newnote = {
        id:id,
        name:request.body.name,
        number:request.body.number
    }
    notes = notes.concat(newnote)
    response.json(newnote)
})

const port = 3001
app.listen(port,()=>console.log(`app running on port ${port}`))
