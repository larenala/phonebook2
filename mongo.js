const mongoose = require('mongoose')

const url = 'mongodb://laura:routa-Aika1980@ds125302.mlab.com:25302/puhluettelo3'

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

if (!process.argv[2]) {
  Person
    .find({})
    .then(result => {
      console.log("puhelinluettelo: ")
      result.forEach(person => {
        console.log(person.name, person.number)
        mongoose.connection.close()
      })
    })
} else {
  const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
  })

  person
    .save()
    .then(response => {
      console.log(`lisätään henkilö ${response.name} ${response.number} luetteloon.`)
      mongoose.connection.close()
    })

}
