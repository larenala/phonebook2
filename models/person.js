const mongoose = require('mongoose')

const url = 'mongodb://laura:routa-Aika1980@ds125302.mlab.com:25302/puhluettelo3'
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.statics.format = function (person) {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

const Person = mongoose.model('Person', personSchema);



module.exports = Person
