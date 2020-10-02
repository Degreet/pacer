require('c4console')
const { MongoClient, ObjectId } = require("mongodb")
const { createServer } = require('http')
const fs = require('fs'), fsp = fs.promises
const bcrypt = require('bcrypt')
const Cookies = require('cookies')
const dotenv = require('dotenv')
dotenv.config()

const PORT = process.env.PORT || 3000
const pass = process.env.KEY
const server = createServer(requestHandler)
const uri = `mongodb+srv://Node:${pass}@cluster0-ttfss.mongodb.net/pacer?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

async function requestHandler(req, resp) {
  let { url } = req
  const cookies = new Cookies(req, resp)
  resp.setHeader('Content-Type', 'text/html')

  if (url.startsWith('/api/')) {
    url = url.slice(5)

    if (url == 'reg') {
      const user = JSON.parse(await streamToString(req))
      const candidateLogin = await users.findOne({ login: user.login })
      const candidateEmail = await users.findOne({ email: user.email })
      const data = {}

      if (candidateLogin) {
        data.success = false
        data.msg = `Такой логин уже занят!`
      } else if (candidateEmail) {
        data.success = false
        data.msg = `Такой Email уже зарегистрирован!`
      } else {
        const pass = user.pass
        const hashPass = bcrypt.hashSync(pass, 10)
        const token = generateToken()

        user.pass = hashPass
        user.date = new Date().toISOString().slice(0, 19).replace("T", " ")
        user.token = token

        cookies.set("token", token)
        await users.insertOne(user)
        data.success = true
      }

      resp.end(JSON.stringify(data))
    } else if (url == "logout") {
      cookies.set("token", null)
      resp.end()
    }
  } else if (url == "/reg") {
    const result = await getCandidate(cookies, true)
      ? await getPage("Pacer - Регистрация", buildPath("reg.html"), "reg")
      : `<script>location.href = '/dashboard'</script>`
    resp.end(result)
  } else {
    let path = process.cwd() + '/public' + url.replace(/\/$/, '')

    try {
      const target = await fsp.stat(path).catch(_ => fsp.stat(path += '.html'))
      if (target.isDirectory()) path += '/index.html'
      const match = path.match(/\.(\w+)$/), ext = match ? match[1] : 'html'

      if (path.endsWith("/public/index.html")) {
        const result = await getCandidate(cookies, true)
          ? await getPage("Pacer - Главная", buildPath("index.html"), "main")
          : `<script>location.href = '/dashboard'</script>`
        resp.end(result)
      } else {
        fs.createReadStream(path).pipe(resp)
        resp.setHeader('Content-Type', {
          html: 'text/html',
          json: 'application/json',
          css: 'text/css',
          ico: 'image/x-icon',
          jpg: 'image/jpeg',
          png: 'image/png',
          gif: 'image/gif',
          svg: 'image/svg+xml',
          js: 'application/javascript',
        }[ext])
      }
    } catch {
      resp.end(await getPage("Pacer - Ошибка №404", buildPath("errors/404.html")))
    }
  }
}

async function getCandidate(cookies, needCheck) {
  const token = cookies.get("token")
  const candidate = await users.findOne({ token })
  return needCheck ? candidate ? false : true : candidate
}

function buildPath(path) {
  return `${__dirname}/public/${path}`
}

async function getPage(title, path, scriptName) {
  const [file] = await Promise.all([fsp.readFile(path)])
  const html = await buildPage(title, file.toString(), scriptName)
  return html
}

function streamToString(stream) {
  const chunks = []
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
  })
}

async function buildPage(title, body, scriptName) {
  const [file] = await Promise.all([fsp.readFile(buildPath("templates/body.html"))])
  const html = file.toString()
    .replace("PAGE_TITLE", title)
    .replace("PAGE_BODY", body)
    .replace("MORE_SCRIPT", scriptName ? `<script src="/js/${scriptName}.js"></script>` : "")
  return html
}

function generateToken() {
  let res = ''
  const chars = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890'
  for (let i = 0; i < 32; i++) res += chars[Math.floor(Math.random() * chars.length)]
  return res
}

client.connect(err => {
  if (err) console.log(err)

  global.users = client.db("pacer").collection("users")

  server.listen(PORT, () => console.log('Server started at http://localhost:3000'))
  setTimeout(() => client.close(), 1e9)
})