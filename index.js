const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


app.use(bodyParser.json())
morgan.token('type', function (req, res) {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :response-time :type :status :res[content-length] - :response-time ms'))
app.use(cors())


app.get("/info", (req, res) => {
  Person.estimatedDocumentCount({}).then(num => {
    if(num) {
      res.send(`<p>Puhelinluettelossa on ${num} henkilön tiedot.</p><p>Tänään on ${new Date()}.</p>`)
    } else {
      res.status(404).end()
    }
  })

})

app.get("/api/persons", (req, res) => {
  Person
    .find({})
    .then(people => {
      res.json(people.map(Person.format))
    })
    .catch(error => {
      console.log(error)
    })

})

app.get("/api/persons/:id", (req, res) => {
  let id = req.params.id
  Person
    .findById(id)
    .then(person => {
      if (person) {
        res.json(Person.format(person))
      } else {
        res.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: "malformatted id"})
    })

})

app.post("/api/persons", (req, res) => {
  const body = req.body

  if (body.name === "" || body.number === "") {
    return res.status(400).json({error: "Name or number missing."})
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

   person
    .save()
    .then(savedPerson => {
      console.log("Saved person: ", savedPerson)
      res.json(Person.format(person))
    })
    .catch(error => {
      console.log("Error: ", error)
    })
})

app.put("/api/persons/:id", (req, res) => {
  const body = req.body
  console.log(body)
  const person = {
      name: body.name,
      number: body.number
    }

  Person
    .findOneAndUpdate({_id: req.params.id}, person, {new: true})
    .then(updatedPerson => {
      res.json(Person.format(updatedPerson))
    })
    .catch(error => {
      console.log(error)
    })
})

app.delete("/api/persons/:id", (req, res) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => {
      response.status(400).send({error: "malformatted id"})
    })
})

const error = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(error)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
