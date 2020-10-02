addEventListener("keydown", e => {
  if (e.ctrlKey && e.shiftKey && e.key == "E") {
    fetch("/api/logout").then(() => location.href = '/')
  }
})