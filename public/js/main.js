if (localStorage.skipAnimation) document.querySelector("*").forEach(el => el.style.transition = "0s")

onkeydown = e => {
  if (e.key == 's') {
    localStorage.skipAnimation = true
  }
}

onload = () => {
  const allButtons = document.querySelectorAll("button")
  allButtons.forEach(btn => {
    const redirectAttr = btn.getAttribute("redirect")
    if (redirectAttr) btn.addEventListener("click", () => location.href = redirectAttr)
  })

  loader.classList.add("loaded")
  setTimeout(() => {
    header.classList.add("show")
    header.ontransitionend = () => {
      setTimeout(() => {
        title.classList.add("show")
        title.ontransitionend = () => {
          title.classList.add("end")
          title.ontransitionend = () => {
            desc.classList.add("show")
            desc.ontransitionend = () => {
              btns.classList.add("show")
            }
          }
        }
      })
    }
  }, 1000)
}