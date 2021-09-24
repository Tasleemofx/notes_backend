const express = require('express')
const app = express()
const cors = require('cors')
let notes = require('./notes')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))


app.get('/', (request,response)=>{
    response.end('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response)=>{
    response.json(notes)
})

app.get('/api/notes/:id', (request, response)=>{
    const id = Number(request.params.id);
    const note = notes.find(n=> n.id===id)
    if(note){
    response.json(note)
    } else{
        response.status(404).end()
    }
})
app.put('api/notes/:id', (request, response)=>{
  const id = Number(request.params.id)
  let note = notes.find(n=> n.id===id)
  console.log("note1", note)
  if(!note){
    response.status(204).json({error: "note does not exist"})
  }else{
    const newNote = {...note, important: !important}
    note = newNote;
    response.json(note)
  }
})
const generateId=()=>{
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0
    return maxId + 1;
}
app.post('/api/notes', (request, response)=>{
    const body = request.body

    if(!body.content){
        response.status(400).json({ error: "content missing"})
    }
    const note ={
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId()
    }
    notes = notes.concat(note)
    response.json(notes)
})

app.delete('/api/notes/:id', (request, response)=>{
    const note = notes.find(n=> n.id===Number(request.params.id))
    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})
