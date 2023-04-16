require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/note')
app.use(express.json())
app.use(cors())

const requestLogger = (request, response, next)  => {
    console.log('Method: ', request.method);
    console.log('Path: ', request.path);
    console.log('Body: ', request.body);
    console.log('----------------------------------------------');
    next()

}  

app.use(requestLogger)

app.get('/', (request, response) => {
    response.send('<h1>Welcome to Notes Api</h1>')
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})


app.get('/api/notes/:id', (request, response) => {
    const noteId = request.params.id;
    Note.findById(noteId)
        .then(note => {
            if (!note) {
                return response.status(404).json({
                    error: 'Note not found'
                })
            }
            response.json(note)
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({
                error: 'Server error'
            })
        })
})


app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id;
    Note.findByIdAndDelete(id)
        .then(note => {
            if (!note) {
                return response.status(404).json({
                    error: 'Note not found'
                })
            }
            response.status(204).send();
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({
                error: 'Server error'
            })
        })
})


app.put('/api/notes/:id', (request, response) => {
    const id = request.params.id
    const body = request.body
    //console.log(body)

    Note.findByIdAndUpdate(id, body, { new: true })
        .then(updatedNote => {
            response.json(updatedNote);
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({
                error: 'Server error'
            });
        });
});

app.post('/api/notes', (request, response) => {
    const body = request.body
    if (!body.content) {
        return response.status(400).json(
            {
                error: "content missing"
            }
        )
    }
    const note = Note({
        content: body.content,
        important: body.important || false,
        date: new Date()
    })
    note.save().then(savedNote => {
        response.json(savedNote)
    })
    
})

/*const app = http.createServer((request, response) => {
    response.writeHead(200,{'Content-Type': 'application/json'})
    response.end(JSON.stringify(notes))
})*/
const  unknownPath = (request, response) => {
    response.status(404).json({
        error: 'unknown Path'
    })
} 

app.use(unknownPath)
const PORT = process.env.PORT 
app.listen(PORT, ()=> {
    console.log(`Server running in port ${PORT}`)
})