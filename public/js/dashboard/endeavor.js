const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'))
tooltipList = tooltipTriggerList.map(el => new bootstrap.Tooltip(el))

endeavorInp.oninput = endeavorInp.onchange = () => {
  const endeavor = endeavorInp.value

  if (endeavor.length < 3 || endeavor.length > 256) {
    saveEndeavorBtn.className = saveEndeavorBtn.className.replace("success", "danger")
  } else {
    saveEndeavorBtn.className = saveEndeavorBtn.className.replace("danger", "success")
  }
}

saveEndeavorBtn.onclick = () => {
  const endeavor = endeavorInp.value
  const cats = getCats()

  if (endeavor.length < 3 || endeavor.length > 256) {
    new Alert("danger", `Длина стремления должна быть от 3 до 256 символов`).show()
    saveEndeavorBtn.className = saveEndeavorBtn.className.replace("success", "danger")
  } else {
    saveEndeavorBtn.disabled = true

    fetch(`/api/dashboard/add-endeavor`, {
      method: "POST",
      body: JSON.stringify({ endeavor, cats })
    }).then(resp => resp.json()).then(data => {
      if (data.success) {
        saveEndeavorBtn.disabled = false
        new Alert("success", `Новое стремление добавлено!`).show()
      } else {
        new Alert("danger", data.msg).show()
      }
    })
  }
}

function getCats() {
  return [...endeavorCatsDiv.querySelectorAll(`:checked`)].map(inp => inp.value).join()
}