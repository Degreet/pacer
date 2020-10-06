goBtn.onclick = () => {
  const pass = passInp.value
  const passConf = passConfInp.value
  let err

  if (pass.length < 8 || pass.length > 32) {
    err = "Пароль должен содержать от 8 до 32 символов"
  } else if (pass != passConf) {
    err = "Введенные пароли не совпадают."
  }

  if (err) {
    const alert = new Alert("danger", err)
    alert.show()
  } else {
    const id = location.href.match(/[^\/]*$/)[0]
    fetch("/api/change-pass", {
      method: "POST",
      body: JSON.stringify({ id, pass })
    }).then(() => {
      const alert = new Alert("success", "Вы успешно сменили пароль!")
      alert.show()
      setTimeout(() => location.href = '/dashboard', 1000)
    })
  }
}