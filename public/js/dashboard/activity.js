const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'))
tooltipList = tooltipTriggerList.map(el => new bootstrap.Tooltip(el))

const aboutActivityModalBS = new bootstrap.Modal(aboutActivityModal)

const schemata = [
  "ежедневно", "через день", "день через два",
  "день через три", "день через четыре", "день через пять", "еженедельно"]

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

function aboutModal(activity) {
  aboutActivityModal.querySelector(".modal-body").innerHTML = /*html*/`
    <div>Действие: ${activity.activity}</div>
    <div>Регулярность: ${schemata[activity.schema - 1]}</div>
    <div>Мера: ${activity.measure}</div>
    <div>Сложность: ${activity.hard}</div>
  `

  aboutActivityModalTitle.innerText = activity.activity
  takeQuestBtn.onclick = () => {}
  aboutActivityModalBS.toggle()
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