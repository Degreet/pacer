require('c4console')
const { MongoClient } = require("mongodb")
const { createServer } = require('http')
const dotenv = require('dotenv')
dotenv.config()

const dev = !process.env.PORT
if (dev) require = require("up2require")(require)

const PORT = process.env.PORT || 3000
const pass = process.env.KEY

const requestHandler = require("./requestHandler.js", dev)
const server = createServer(requestHandler)
const uri = `mongodb+srv://Node:${pass}@cluster0-ttfss.mongodb.net/pacer?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

client.connect(err => {
  if (err) console.log(err)

  global.users = client.db("pacer").collection("users")
  global.links = client.db("pacer").collection("links")
  global.endeavors = client.db("pacer").collection("endeavors")
  global.activities = client.db("pacer").collection("activities")

  server.listen(PORT, () => console.log('Server started at http://localhost:3000'))
  setTimeout(() => client.close(), 1e9)
})