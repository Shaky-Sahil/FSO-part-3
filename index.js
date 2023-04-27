const express = require('express')
const app = express()

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

const port = 3001
app.listen(port,()=>console.log(`app running on port ${port}`))
