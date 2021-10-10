require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/note')
// let notes = require('./notes')



app.use(express.json())
app.use(cors())
app.use(express.static('build'))
app.use(express.urlencoded({extended:true}))


app.get('/', (request,response)=>{
    response.end('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response)=>{
    Note.find({}).then(notes=>{
        response.json(notes)
    })
    
})

app.get('/api/notes/:id', (request, response)=>{
    const id = (request.params.id);
    Note.findById(id).then(note=>{
        if (note) {
            response.json(note)
        } else {
            response.status(404).end()
        }
})
    
})
app.put('api/notes/:id', (request, response, next)=>{
    const body = request.body

    const note = {
        content: body.content,
        important: body.important,
    }

    Note.findByIdAndUpdate(request.params.id, note, { new: true })
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})
app.post('/api/notes', (request, response)=>{
    const body = request.body
    const newContent = body.content
   
    if(newContent === undefined){
        return response.status(400).json({ error: "content missing"})
    }
    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date()
    })
    note
    .save()
    .then(savedNote=> {
        return savedNote.toJSON()
    })
        .then(FormattedNote=>{
        response.json(FormattedNote)
    })
    .catch(error=> next(error))
})
app.delete('/api/notes/:id', (request, response)=>{
   Note.findByIdAndRemove(request.params.id)
    .then(res=>response.status(204).end()
    )
})

const PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})

