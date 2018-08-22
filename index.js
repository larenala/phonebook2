const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(bodyParser.json())
morgan.token('type', function (req, res) {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :response-time :type :status :res[content-length] - :response-time ms'))
app.use(cors())
app.use(express.static('build'))

let people = [
  {
    name: "Arto Hellas",
    number: "040-89332123",
    id: 1
  },
  {
    name: "Lea Kutvonen",
    number: "050-3213367",
    id: 2
  },
  {
    name: "Marko Marko",
    number: "09-6563653",
    id: 3
  }
]

app.get("/info", (req, res) => {
  res.send(`<p>Puhelinluettelossa ${people.length} henkilön tiedot.</p><p>Tänään on ${new Date()}.</p>`)
})

app.get("/api/persons", (req, res) => {
  res.json(people)
})

app.get("/api/persons/:id", (req, res) => {
  let id = Number(req.params.id)
  const person = people.find(p => p.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})


app.post("/api/persons", (req, res) => {
  const body = req.body

  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({error: "Name or number missing."})
  }

  if(people.find(p => p.name === body.name)) {
    return res.status(400).json({error: "Name must be unique"})
  }

  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * (10000 - people.length +1 )) + people.length
  }

  people = people.concat(person)
  res.json(person)
})

app.delete("/api/persons/:id", (req, res) => {
  let id = Number(req.params.id)
  people = people.filter(p => p.id !== id)
  res.status(204).end()
})

const error = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(error)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
