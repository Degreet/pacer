const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'))
tooltipList = tooltipTriggerList.map(el => new bootstrap.Tooltip(el))

loginInp.oninput = emailInp.oninput = passInp.oninput = passConfInp.oninput = goBtn.onclick = e => {
  const login = loginInp.value
  const email = emailInp.value
  const pass = passInp.value
  const passConf = passConfInp.value
  const checkEmailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  let err

  if (login.length < 3 || login.length > 20) {
    err = `Логин должен содержать от 3 до 20 символов`
  } else if (!checkEmailReg.test(email.toLowerCase())) {
    err = `Вы ввели некорректный Email!`
  } else if (pass.length < 8 || pass.length > 32) {
    err = `Пароль должен содержать от 8 до 32 символов`
  } else if (pass != passConf) {
    err = `Введенные пароли не совпадают`
  }

  if (err) {
    goBtn.setAttribute("data-original-title", "Не все поля заполнены корректно!")
    if (e.target == goBtn) {
      const alert = new Alert("danger", err)
      alert.show()
    } else {
      goBtn.className = `btn btn-danger`
    }
  } else {
    goBtn.setAttribute("data-original-title", "Все поля указаны верно!")
    if (e.target == goBtn) {
      const alert = new Alert("success", `Успешно!`)
      alert.show()
    } else {
      goBtn.className = `btn btn-success`
    }
  }
}