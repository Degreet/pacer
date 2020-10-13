class Alert {
  constructor(type, text) {
    const alert = document.createElement("div")
    alert.className = `alert alert-${type}`
    alert.id = `alert`
    alert.innerText = text
    document.body.append(alert)
    this.alert = alert
  }

  setType(type) {
    this.alert.className = `alert alert-${type}`
  }

  setText(text) {
    this.alert.innerText = text
  }

  toggle(on) {
    setTimeout(() => this.alert.classList.add(on), 100)
  }

  show() {
    setTimeout(() => this.alert.classList.add("show"), 100)
    setTimeout(() => this.hide(), 6000)
  }

  hide() {
    setTimeout(() => this.alert.classList.remove("show"), 100)
  }
}