class Alert {
  constructor(type, text) {
    const alert = document.createElement("div")
    alert.className = `alert alert-${type}`
    alert.innerText = text
    document.body.append(alert)
    this.alert = alert

    const styles = document.createElement("style")
    styles.innerHTML = /*css*/`
      .alert {
        transform: translateY(-150%);
        transition: 1s;
      }
      
      .alert.show {
        transform: translateY(0);
      }
    `
    
    document.head.append(styles)
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
    setTimeout(() => this.alert.classList.add("show"))
  }

  hide() {
    this.alert.classList.remove("show")
  }
}