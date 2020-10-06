changePassBtn.onclick = () => {
  const oldPass = passOldInp.value
  const newPass = passNewInp.value
  const newConfPass = passNewConfInp.value
  let err

  if (!oldPass) {
    err = "Вы не ввели старый пароль"
  } else if (newPass.length < 8 || newPass.length > 32) {
    err = `Пароль должен содержать от 8 до 32 символов.`
  } else if (newPass != newConfPass) {
    err = `Новые пароли не совпадают.`
  }

  if (err) {
    const alert = new Alert("danger", err)
    alert.show()
  } else {
    fetch("/api/dashboard/change-pass", {
      method: "POST",
      body: JSON.stringify({ oldPass, newPass })
    }).then(resp => resp.json()).then(data => {
      if (data.success) {
        const alert = new Alert("success", `Ваш пароль успешно изменён!`)
        alert.show()
      } else {
        const alert = new Alert("danger", data.msg)
        alert.show()
      }
    })
  }
}

forgotPassBtn.onclick = () => {
  fetch("/api/forgot-pass").then(() => {
    const alert = new Alert("success", "На ваш email поступило письмо.")
    alert.show()
  })
}

logoutBtn.onclick = () => {
  fetch("/api/logout").then(() => {
    new Alert("success", "Вы успешно вышли!").show()
    setTimeout(() => location.href = '/auth', 1000)
  })
}