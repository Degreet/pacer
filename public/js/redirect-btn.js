addEventListener("load", () => {
  const allButtons = document.querySelectorAll("button")
  allButtons.forEach(btn => {
    const redirectAttr = btn.getAttribute("redirect")
    if (redirectAttr) btn.addEventListener("click", () => location.href = redirectAttr)
  })
})