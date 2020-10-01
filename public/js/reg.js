const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'))
tooltipList = tooltipTriggerList.map(el => new bootstrap.Tooltip(el))

loginInp.oninput = emailInp.oninput = passInp.oninput = passConfInp.oninput = goBtn.onclick = e => {
  const login = loginInp.value
  const email = emailInp.value
  const pass = passInp.value
  const passConf = passConfInp.value
  let err

  if (login.length < 3 || login.length > 20) {
    err = `Логин должен содержать от 3 до 20 символов`
  } else if (!email) {
    err = `Вы не ввели email!`
  } else if (pass != passConf) {
    err = `Введенные пароли не совпадают`
  } else if (pass.length < 8 || pass.length > 32) {
    err = `Пароль должен содержать от 8 до 32 символов`
  }

  if (err) {
    if (e.target == goBtn) {
      const alert = new Alert("danger", err)
      alert.show()
    } else {
      goBtn.className = `btn btn-danger`
    }
  } else {
    if (e.target == goBtn) {
      goBtn.onclick = null
      const alert = new Alert("success", `Успешно!`)
      alert.show()
    } else {
      goBtn.className = `btn btn-success`
    }
  }
}