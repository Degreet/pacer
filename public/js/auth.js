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

forgotPassBtn.onclick = () => {
  const email = loginInp.value
  const checkEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if (checkEmail.test(email.toLowerCase())) {
    fetch("/api/forgot-pass", {
      method: "POST",
      body: JSON.stringify({ email })
    }).then(resp => resp.json()).then(data => {
      if (data.success) {
        const alert = new Alert("success", "На ваш email поступило письмо.")
        alert.show()
      } else {
        new Alert("danger", data.msg).show()
      }
    })
  } else {
    new Alert("danger", "Вы ввели неверный Email.").show()
  }
}