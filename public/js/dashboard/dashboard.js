moment.locale("ru")

logoutBtn.onclick = () => {
  fetch("/api/logout").then(() => location.href = '/auth')
}

function getDate() {
  const now = moment()
  time.innerText = now.format("dddd, Do MMMM YYYY")
  clock.innerText = now.format('HH:mm:ss')
}

getDate()
setInterval(getDate, 1000)