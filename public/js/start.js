const confidenceAnswers = document.querySelectorAll("[name='confidence']")

confidenceAnswers.forEach(answer => answer.onchange = e => {
  if (answer.checked && answer.value == "1") {
    const alert = new Alert("danger",
      "С такой низкой верой в себя стоит обратиться к психологу. Мы не готовы взяться за Ваш случай")
    alert.show()

    startBtn.classList.remove("btn-success")
    startBtn.classList.add("btn-danger")
    startBtn.onclick = null
  } else {
    startBtn.classList.remove("btn-danger")
    startBtn.classList.add("btn-success")

    startBtn.onclick = () => {
      const val = +answer.value

      fetch("/api/dashboard/start", {
        method: "POST",
        body: JSON.stringify({ confidence: val })
      }).then(resp => resp.json()).then(data => {
        if (data.success) {
          location.href = '/dashboard'
        } else {
          new Alert("danger", data.msg).show()
        }
      })
    }
  }
})