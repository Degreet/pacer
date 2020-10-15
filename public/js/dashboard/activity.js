const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'))
tooltipList = tooltipTriggerList.map(el => new bootstrap.Tooltip(el))

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

activityList.querySelectorAll("li").forEach(li => {
  const id = li.dataset.id

  fetch("/api/get-activity", {
    method: "POST",
    body: JSON.stringify({ id })
  }).then(resp => resp.json()).then(data => {
    if (data.success) {
      const { activity } = data
      const modalEl = document.createElement("div")
      document.body.append(modalEl)

      modalEl.className = "modal fade"
      modalEl.setAttribute("aria-hidden", true)

      modalEl.innerHTML = /*html*/`
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${activity.activity}</h5>
              <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div>Действие: ${activity.activity}</div>
              <div>Регулярность: ${schemata[activity.schema - 1]}</div>
              <div>Мера: ${activity.measure}</div>
              <div>Сложность: ${activity.hard}</div>
              <button class="btn btn-primary mt-2">Взять квест!</button>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
            </div>
          </div>
        </div>
      `

      const modal = new bootstrap.Modal(modalEl)
      li.onclick = () => modal.toggle()
    } else {
      const alert = new Alert("danger", `Произошла ошибка.`)
      alert.show()
    }
  })
})