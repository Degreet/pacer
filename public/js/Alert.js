class Alert {
  constructor(type, text) {
    const alert = document.createElement("div")
    this.alert = alert
    alert.className = `alert alert-${type}`
    alert.innerText = text
    document.body.append(alert)
  }

  setType(type) {
    this.alert.className = `alert alert-${type}`
  }

  setText(text) {
    this.alert.innerText = text
  }

  toggle(on) {
    this.alert.classList.add(on)
  }

  show() {
    this.alert.classList.add("show")
  }

  hide() {
    this.alert.classList.remove("show")
  }
}