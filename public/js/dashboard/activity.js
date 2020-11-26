const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'))
tooltipList = tooltipTriggerList.map(el => new bootstrap.Tooltip(el))

const aboutActivityModalBS = new bootstrap.Modal(aboutActivityModal)
const takeQuestModalBS = new bootstrap.Modal(takeQuestModal)

const schemata = [
  "ежедневно", "через день", "день через два",
  "день через три", "день через четыре", "день через пять", "еженедельно"]

const months = [
  'Январь', 'Февраль', 'Март',
  'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь',
  'Октябрь', 'Ноябрь', 'Декабрь'
]

const scale = new ScaleOfNums({ stylesType: "bootstrap" })
scale.createScale(1, 10, "hardScale")
scale.appendToParent(hardDiv)

saveActivityBtn.onclick = () => {
  const activity = activityInp.value
  const measure = measureInp.value
  const schema = +schemaSelect.value
  const hard = +scale.getCheckedValue()
  let err

  if (activity.length < 3 || activity.length > 256) err = `Длина формулировки должна быть от 3 до 256 символов`
  else if (!measure.length) err = `Определи меру`
  else if (!schema) err = "Укажи регулярность"
  else if (!hard) err = "Определи сложность"

  if (err) {
    const alert = new Alert("danger", err)
    alert.show()
  } else {
    fetch(`/api/dashboard/new-activity`, {
      method: "POST",
      body: JSON.stringify({ activity, measure, schema, hard })
    }).then(() => {
      new Alert("success", "Ты успешно добавил действие!").show()
      saveActivityBtn.className = saveActivityBtn.className.replace("danger", "success")
    })
  }
}

function createQuestModal(activity) {
  const confidence = +confidenceSpan.innerText
  const maxLength = Math.floor(confidenceSpan.innerText / activity.hard)
  const length = Math.floor(maxLength / 2)

  takeQuestModal.querySelector(".modal-body").innerHTML = /*html*/`
    <div>Ты решаешь: ${activity.activity}, ${activity.measure} (${schemata[activity.schema - 1]}) столько раз:</div>
    <div id="questLengthScale"></div>
    <div class="mt-3">Залог:
      <span id="pledge" class="badge bg-warning text-dark ml-2 mr-2" style="font-size:16px">36</span>
      <span class="text-muted">(срок <span id="lengthCalcSpan">${length}</span> &times; сложность ${activity.hard})</span>
      из: <span class="badge bg-warning text-dark ml-2 mr-2" style="font-size:16px">${confidence}</span>
    </div>
    <div class="d-flex mt-3 justify-content-around">
      <span class="mr-2">Старт квеста</span>
      <div class="d-flex mr-2">
        <div class="form-check mr-3">
          <input class="form-check-input" type="radio" name="flexRadioDefault" id="todayStartQuest">
          <label class="form-check-label" for="flexRadioDefault1">
            Сегодня
          </label>
        </div>
        <div class="form-check mr-3">
          <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2">
          <label class="form-check-label" for="flexRadioDefault2">
            Завтра
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault3">
          <label class="form-check-label" for="flexRadioDefault3">
            Послезавтра
          </label>
        </div>
      </div>
    </div>

    ${buildCalendars(new Date, 1000)}
  `

  takeQuestModal.querySelectorAll("[data-toggle='tooltip']")
    .forEach(el => new bootstrap.Tooltip(el))

  const scale = new ScaleOfNums({ stylesType: "bootstrap" })
  scale.createScale(1, Math.min(maxLength, 37), "quest-length")
  scale.appendToParent(questLengthScale)

  questLengthScale.querySelector(".d-flex").innerHTML += `
    <input style="width:15%;transform:translate(11px,9px);height:40px"
      type="number" min="1" max="${maxLength}" id="questLengthInp" class="form-control" value="${length}">
  `

  questLengthScale.querySelectorAll(`label input`).forEach(inp => {
    inp.onchange = () => {
      if (inp.checked) {
        setLength(inp.value)
      }
    }
  })

  questLengthInp.onchange = () => {
    setLength(+questLengthInp.value)
  }

  function setLength(length) {
    length = Math.max(Math.min(length, maxLength), 1)
    questLengthScale.querySelector(`[type="radio"][name="quest-length"][value="${length}"]`).checked = true
    questLengthInp.value = length
    lengthCalcSpan.innerText = length
    pledge.innerText = length * activity.hard
    todayStartQuest.disabled = length == 1
    if (length == 1 && todayStartQuest.checked) todayStartQuest.checked = false
  }

  setLength(length)
  aboutActivityModalBS.hide()
  takeQuestModalBS.show()
}

function makePlan(schema, length, start) {
  const date = new Date
  date.setDate(date.getDate() + start)

  const dates = []

  for (let i = 0; i < length; i++) {
    dates.push(new Date(date).toISOString().slice(0, 10))
    date.setDate(date.getDate() + schema)
  }

  return dates
}

function toISOLocal(d) {
  var z = n => ('0' + n).slice(-2)
  var zz = n => ('00' + n).slice(-3)
  var off = d.getTimezoneOffset()
  var sign = off < 0 ? '+' : '-'
  off = Math.abs(off)

  return d.getFullYear() + '-'
    + z(d.getMonth() + 1) + '-' +
    z(d.getDate()) + 'T' +
    z(d.getHours()) + ':' +
    z(d.getMinutes()) + ':' +
    z(d.getSeconds()) + '.' +
    zz(d.getMilliseconds()) +
    sign + z(off / 60 | 0) + ':' + z(off % 60)
}

function showPlan(plan) {
  const carousel = document.querySelector(".carousel-inner")
  carousel.querySelectorAll(".custom-badge").forEach(el => el.classList.remove("custom-badge"))

  plan.forEach(date => carousel.querySelector(`[data-date="${date}"]`)
    .classList.add("custom-badge"))
}

function buildMonth({ year, month }) {
  const dates = []
  let date = new Date(year, month)

  for (let i = 1; i <= 31; i++) {
    if (date.getMonth() == month) dates.push(i)
    else break

    date.setDate(date.getDate() + 1)
  }

  const prevDates = []
  date = new Date(year, month)

  if (date.getDay() != 1) {
    date.setDate(date.getDate() - (date.getDay() || 7) + 1)
    while (date.getMonth() != month) {
      prevDates.push(date.getDate())
      date.setDate(date.getDate() + 1)
    }
  }

  const nextDates = []
  date = new Date(year, month + 1)

  while (date.getDay() != 1) {
    nextDates.push(date.getDate())
    date.setDate(date.getDate() + 1)
  }

  return /*html*/`
    <div class="month">
      <span class="name" data-toggle="tooltip" data-placement="top" title="${year} год">${months[month]}</span>
      <div class="days">
        <span class="text-muted">пн</span>
        <span class="text-muted">вт</span>
        <span class="text-muted">ср</span>
        <span class="text-muted">чт</span>
        <span class="text-muted">пт</span>
        <span class="text-muted">сб</span>
        <span class="text-muted">вс</span>
      </div>
      <div class="dates">
        ${prevDates.map(date => `<span class="text-muted">${date}</span>`).join("")}
        ${dates.map(date =>
    `<span data-date="${toISOLocal(new Date(year, month, date)).slice(0, 10)}">${date}</span>`).join("")}
        ${nextDates.map(date => `<span class="text-muted">${date}</span>`).join("")}
      </div>
    </div>
  `
}

function buildCalendars(start, length) {
  const dateEnd = new Date(start)
  dateEnd.setDate(dateEnd.getDate() + length)

  const startYear = start.getFullYear()
  const endYear = dateEnd.getFullYear()
  const monthStart = start.getMonth()
  const monthEnd = dateEnd.getMonth()
  let monthsCount = (endYear - startYear) * 12 + monthEnd - monthStart + 1

  if (monthsCount % 2) monthsCount++

  const months = []
  const date = new Date(start)

  for (let i = 0; i < monthsCount; i++) {
    months.push({
      year: date.getFullYear(),
      month: date.getMonth()
    })

    date.setMonth(date.getMonth() + 1)
  }

  const monthPairs = []
  for (let i = 0; i < months.length; i += 2)
    monthPairs.push([months[i], months[i + 1]])

  return `
    <div id="carouselExampleControls" class="carousel carousel-dark slide" data-ride="carousel" data-interval="0">
      <div class="carousel-inner">
        ${monthPairs.map((pair, i) => `
          <div class="carousel-item${i == 0 ? " active" : ""}">
            <div class="calendar" class="mt-3">
              ${pair.map(buildMonth).join("")}
            </div>
          </div>
        `).join("")}
      </div>
      <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </a>
      <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </a>
    </div>
  `
}

function aboutModal(activity) {
  const enough = +confidenceSpan.innerText / activity.hard >= 1

  aboutActivityModal.querySelector(".modal-body").innerHTML = /*html*/`
    <div>Действие: ${activity.activity}</div>
    <div>Регулярность: ${schemata[activity.schema - 1]}</div>
    <div>Мера: ${activity.measure}</div>
    <div>Сложность: ${activity.hard}</div>
  `

  aboutActivityModalTitle.innerText = activity.activity
  aboutActivityModalBS.toggle()

  takeQuestBtn.innerHTML = enough ? "Взять квест!" : "Не достаточно веры в себя..."
  takeQuestBtn.onclick = enough ? () => createQuestModal(activity) : null
}

activityList.onclick = e => {
  if (e.target == activityList) return

  const li = e.target.closest("li")
  const { id } = li.dataset

  fetch("/api/get-activity", {
    method: "POST",
    body: JSON.stringify({ id })
  }).then(resp => resp.json()).then(data => {
    aboutModal(data.activity)
  })
}