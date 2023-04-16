//mongodb+srv://fullstack:<password>@karendatabase.5dvtrdg.mongodb.net/?retryWrites=true&w=majority

const mongoose = require('mongoose')

if (process.argv.length != 4) {
    console.log('Error, need provide password: node mongo.js <password> <content>')
    process.exit(1)
}

const password = process.argv[2]

const noteContent = process.argv[3]

const url = `mongodb+srv://fullstack:${password}@karendatabase.5dvtrdg.mongodb.net/app-note?retryWrites=true&w=majority`

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important : Boolean
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
    content: noteContent,
    date: new Date(),
    important: true
})
/*
note.save().then(result => {
    console.log('Note saved');
    console.log(result)
    mongoose.connection.close()
})
*/

Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})