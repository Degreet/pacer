header.classList.add("show")
header.ontransitionend = () => {
  setTimeout(() => {
    title.classList.add("show")
    title.ontransitionend = () => {
      title.classList.add("end")
      title.ontransitionend = () => desc.classList.add("show")
    }
  })
}