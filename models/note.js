const mongoose = require('mongoose')

//const url = process.env.MONGODB_URI

const url = process.argv[2]
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB');
    })
    .catch(error => {
        console.log('error connecting to MongoDb')
    })

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important : Boolean
})

noteSchema.set('toJSON',  { 
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject.__v, returnedObject.__id
    }
})
module.exports = mongoose.model('Note', noteSchema)
    