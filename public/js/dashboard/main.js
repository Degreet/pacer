function timer() {
  const now = moment()
  time.innerText = now.format("HH:mm:ss")
}

moment.locale("ru")
setInterval(timer, 1000)
timer()