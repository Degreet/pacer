const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'))
tooltipList = tooltipTriggerList.map(el => new bootstrap.Tooltip(el))

goBtn.onclick = e => {
  const login = loginInp.value
  const pass = passInp.value

  fetch("/api/auth", {
    method: "POST",
    body: JSON.stringify({ login, pass })
  }).then(resp => resp.json()).then(data => {
    if (data.success) {
      const alert = new Alert("success", `Вы успешно вошли!`)
      alert.show()
      setTimeout(() => location.href = '/dashboard', 1200)
    } else {
      const alert = new Alert("danger", data.msg)
      alert.show()
    }
  })
}