require('c4console')
const Cookies = require('cookies')
const bcrypt = require('bcrypt')
const { ObjectId } = require("mongodb")
const fs = require('fs'), fsp = fs.promises
const gmailMsg = require("gmail-send")

module.exports = async function requestHandler(req, resp) {
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
    } else if (url == "auth") {
      const user = JSON.parse(await streamToString(req))
      let candidate = await users.findOne({ login: user.login })
      !candidate ? candidate = await users.findOne({ email: user.email }) : ""
      const data = {}

      if (candidate) {
        const check = bcrypt.compareSync(user.pass, candidate.pass)
        if (check) {
          const token = generateToken()
          await users.updateOne({ login: user.login }, { $set: { token } })
          cookies.set("token", token)
          data.success = true
        } else {
          data.success = false
          data.msg = `Вы ввели неверный пароль`
        }
      } else {
        data.success = false
        data.msg = `Вы ввели неверный логин`
      }

      resp.end(JSON.stringify(data))
    } else if (url == "logout") {
      cookies.set("token", null)
      resp.end()
    } else if (url == "forgot-pass") {
      const data = {}
      let dataServer = {}
      try { dataServer = JSON.parse(await streamToString(req)) } catch { }
      let email

      if (dataServer.email) email = dataServer.email
      else email = (await getCandidate(cookies)).email

      const id = generateToken()
      const link = `${process.env.PORT
        ? "https://pacer-js.herokuapp.com" : "http://localhost:3000"}/confirm-change-pass/${id}`
      const candidate = await getCandidateByData({ email })

      if (candidate) {
        sendMsgToEmail(
          email,
          "Pacer - Смена пароля",
          `
    Здравствуйте, ${candidate.login}! Чтобы изменить пароль, перейдите по данной ссылке: ${link}.
    Данная ссылка действует всего 24 часа, поторопитесь!
          `
        )

        await links.insertOne({
          id,
          started: new Date().toISOString().slice(0, 19).replace("T", " "),
          login: candidate.login,
          finished: false
        })

        data.success = true
      } else {
        data.success = false
        data.msg = "Вы ввели неверный Email."
      }

      resp.end(JSON.stringify(data))
    } else if (url == "change-email") {
      const info = JSON.parse(await streamToString(req))
      const candidate = await getCandidate(cookies)
      const token = cookies.get("token")
      const data = {}

      if (candidate) {
        const checkPass = bcrypt.compareSync(info.pass, candidate.pass)

        if (checkPass) {
          const { newEmail } = info
          const code = generateCode()

          sendMsgToEmail(newEmail, "Pacer - Подтвердите смену Email", `
Чтобы подтвердить смену Email, введите данный код:
<b>${code}</b>
          `)

          await users.updateOne({ token }, { $set: { code } })
          data.success = true
        } else {
          data.success = false
          data.msg = `Вы ввели неверный пароль.`
        }
      }

      resp.end(JSON.stringify(data))
    } else if (url == "confirm-change-email") {
      const { code, newEmail } = JSON.parse(await streamToString(req))
      const candidate = await getCandidate(cookies)
      const token = cookies.get("token")
      const data = {}

      if (candidate) {
        const realCode = candidate.code

        if (realCode) {
          if (realCode == code) {
            data.success = true

            await users.updateOne({ token }, {
              $set: {
                code: null,
                email: newEmail
              }
            })
          } else {
            data.success = false
            data.msg = `Неверный код!`
          }
        } else {
          data.success = false
          data.msg = `Код недоступен!`
        }
      }

      resp.end(JSON.stringify(data))
    } else if (url == "get-activity") {
      const { id } = JSON.parse(await streamToString(req))
      const activity = await activities.findOne({ _id: ObjectId(id) })
      const data = {}

      if (activity) {
        data.success = true
        data.activity = activity
      } else {
        data.success = false
        data.activity = null
      }

      resp.end(JSON.stringify(data))
    } else if (url.startsWith("dashboard/")) {
      url = url.replace("dashboard/", "")

      if (url == "change-pass") {
        const passes = JSON.parse(await streamToString(req))
        const candidate = await getCandidate(cookies)
        const data = {}

        if (candidate) {
          const oldPass = passes.oldPass
          const checkPasses = bcrypt.compareSync(oldPass, candidate.pass)

          if (checkPasses) {
            const newPass = bcrypt.hashSync(passes.newPass, 10)
            await users.updateOne({ _id: candidate._id }, { $set: { pass: newPass } })
            data.success = true
          } else {
            data.success = false
            data.msg = `Неверный пароль.`
          }
        }

        resp.end(JSON.stringify(data))
      } else if (url == "start") {
        const info = JSON.parse(await streamToString(req))
        const candidate = await getCandidate(cookies)
        const token = cookies.get("token")
        const data = {}

        if (candidate && !candidate.etap) {
          const confidence = +info.confidence
          const etap = confidence

          if (!isNaN(confidence) && confidence > 1 && confidence < 11) {
            await users.updateOne({ token }, { $set: { confidence, etap } })
            data.success = true
          } else {
            data.success = false
            data.msg = `Неверные данные`
          }
        }

        resp.end(JSON.stringify(data))
      } else if (url == "add-endeavor") {
        const info = JSON.parse(await streamToString(req))
        const candidate = await getCandidate(cookies)
        const data = {}

        if (candidate) {
          info.date = getDate()
          info.userId = candidate._id

          await endeavors.insertOne(info)
          data.success = true
        } else {
          data.success = false
          data.msg = `Вы не авторизованы`
        }

        resp.end(JSON.stringify(data))
      } else if (url == "new-activity") {
        const info = JSON.parse(await streamToString(req))
        const candidate = await getCandidate(cookies)

        if (candidate) {
          info.date = getDate()
          info.userId = candidate._id
          await activities.insertOne(info)
        }

        resp.end()
      }
    } else if (url == 'change-pass') {
      const data = JSON.parse(await streamToString(req))
      const link = await getLink(data.id)

      if (link) {
        const startedDate = new Date(link.started)
        const nowDate = new Date

        if (!(startedDate.getDate() < nowDate.getDate()
          && startedDate.getHours() < nowDate.getHours()
          || link.finished)) {
          const pass = bcrypt.hashSync(data.pass, 10)
          await users.updateOne({ login: link.login }, { $set: { pass } })
          await links.deleteOne({ id: link.id })
        }
      }

      resp.end()
    }
  } else if (url.startsWith("/confirm-change-pass/")) {
    const id = url.replace("/confirm-change-pass/", "")
    const link = await getLink(id)

    if (link) {
      const startedDate = new Date(link.started)
      const nowDate = new Date

      if (startedDate.getDate() < nowDate.getDate()
        && startedDate.getHours() < nowDate.getHours()
        || link.finished) {
        resp.end(await error404(`Время действия ссылки истекло.`))
      } else {
        resp.end(await getPage("Pacer - Смена пароля", buildPath("change-pass.html"), "change-pass"))
      }
    } else {
      resp.end(await error404())
    }
  } else if (url == "/dashboard") {
    const candidate = await getCandidate(cookies)
    ifCandidate(candidate, async () => {
      if (candidate.etap) {
        let html =
          (await getPage("Pacer - Кабинет", buildPath("dashboard/dashboard.html"), "dashboard/dashboard"))
            .replace(/(<nav id="nav">)/, "$1" + await getFile(buildPath("templates/dashboard-header.htm")))
        html = html
          .replace("$username", candidate.login)
          .replace("$confidence", candidate.confidence)
        resp.end(html)
      } else {
        resp.end(`<script>location.href = '/dashboard/start'</script>`)
      }
    }, async () => {
      resp.end(`<script>location.href = '/auth'</script>`)
    })
  } else if (url.startsWith("/dashboard/")) {
    const candidate = await getCandidate(cookies)
    const page = url.replace("/dashboard/", "")

    ifCandidate(candidate, async () => {
      if (candidate.etap) {
        if (page == "endeavor" || page == "activity") {
          let html =
            (await getPage(`Pacer - ${getTitle(page)}`, buildPath(`dashboard/${page}.html`), [`dashboard/${page}`, `dashboard/main`]))
              .replace(/(<nav id="nav">)/, "$1" + await getFile(buildPath("templates/dashboard-header.htm")))
          html = html
            .replace("$username", candidate.login)
            .replace("</span>", "</span>" + `<span class="text-muted" id="time">00:00:00</span>`)
            .replace("$confidence", candidate.confidence)
          if (page == "endeavor") {
            const userEndeavors = await endeavors.find({ userId: candidate._id }).toArray()
            html = html.replace(/(id="endeavorList">)/, "$1" + userEndeavors.map(buildEndeavor).join(""))
          } else if (page == "activity") {
            const etap = candidate.etap
            const userActivities = await activities.find({ userId: candidate._id }).sort({ _id: -1 }).toArray()
            html = html
              .replace("X", etap)
              .replace(/(id="activityList">)/, "$1" + userActivities.map(buildActivity).join(""))
          }
          resp.end(html)
        } else {
          resp.end(await error404())
        }
      } else {
        resp.end(`<script>location.href = '/start'</script>`)
      }
    }, async () => {
      resp.end(`<script>location.href = '/auth'</script>`)
    })
  } else if (url == "/start") {
    const candidate = await getCandidate(cookies)

    ifCandidate(candidate, async () => {
      if (!candidate.started) resp.end(await getPage("Pacer - Начало", buildPath("start.html"), "start"))
      else resp.end(`<script>location.href = '/dashboard'</script>`)
    }, () => {
      resp.end(`<script>location.href = '/auth'</script>`)
    })

  } else if (url == "/reg") {
    const result = await getCandidate(cookies, true)
      ? await getPage("Pacer - Регистрация", buildPath("reg.html"), "reg")
      : `<script>location.href = '/dashboard'</script>`
    resp.end(result)
  } else if (url == "/auth") {
    const result = await getCandidate(cookies, true)
      ? await getPage("Pacer - Авторизация", buildPath("auth.html"), "auth")
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

function getDate() {
  return new Date().toISOString().slice(0, 19).replace("T", " ")
}

function buildEndeavor(endeavor) {
  return /*html*/`
    <li class="alert alert-primary">
      <h1>${endeavor.endeavor}</h1>
      <button class="btn btn-primary" data-toggle="tooltip" data-placement="top"
        data-html="true" title="${buildCats(endeavor.cats)}">Подробнее</button>
    </li>
  `
}

function buildActivity(activity) {
  return /*html*/`
    <li class="alert alert-primary" style="cursor:pointer" data-id="${activity._id.toString()}">
      <span>${activity.activity}</span>
      <span>${activity.measure}</span>
      <span>
        <span class="badge bg-primary" data-toggle="tooltip" data-placement="top" title="Субъективная сложность">
          ${activity.hard}
        </span>
      </span>
    </li>
  `
}

function buildCats(cats) {
  const allCats = [
    "Желание", "Цель", "Задача",
    "Знание/навык", "Мечта", "Полезная привычка",
    "Проблема", "Гирька", "Вредная привычка"]
  cats = cats.split(",")
  return cats.map(i => `<h4 class='badge bg-secondary mb-1'>${allCats[i]}</h4>`).join(" ")
}

async function getFile(path) {
  const [file] = await Promise.all([fsp.readFile(path)])
  const html = file.toString()
  return html
}

function sendMsgToEmail(email, subject, html) {
  gmailMsg({
    user: 'pacer2020a@gmail.com',
    pass: process.env.GMAIL_PASS,
    to: `<${email}>`,
    subject,
    html
  })()
}

function generateCode() {
  let res = ""
  for (let i = 0; i < 6; i++) res += Math.floor(Math.random() * 9)
  return res
}

async function error404(msg) {
  const page = await getPage("Pacer - Ошибка №404", buildPath("errors/404.html"))
  return page.replace("PAGE_MSG", msg ? msg : "Страница не найдена.")
}

function getTitle(page) {
  return page
    .replace("settings", "Настройки аккаунта")
    .replace("endeavor", "Стремления")
    .replace("activity", "Действия")
}

function ifCandidate(candidate, onTrue, onFalse) {
  (candidate ? onTrue : onFalse)()
}

async function getLink(id) {
  const link = await links.findOne({ id })
  return link
}

async function getCandidateByData(data) {
  return await users.findOne(data)
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
  let html = file.toString()
    .replace("PAGE_TITLE", title)
    .replace("PAGE_BODY", body)

  if (scriptName instanceof Array) {
    html = html.replace("MORE_SCRIPT",
      scriptName.map(script => `<script src="/js/${script}.js"></script>`).join(""))
  } else {
    html = html
      .replace("MORE_SCRIPT", scriptName ? `<script src="/js/${scriptName}.js"></script>` : "")
  }

  return html
}

function generateToken() {
  let res = ''
  const chars = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890'
  for (let i = 0; i < 32; i++) res += chars[Math.floor(Math.random() * chars.length)]
  return res
}