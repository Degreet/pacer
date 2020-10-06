logoutBtn.onclick = () => {
  fetch("/api/logout").then(() => location.href = '/auth')
}