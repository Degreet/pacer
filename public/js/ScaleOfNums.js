class ScaleOfNums {
  constructor(params = {}) {
    if (params.stylesType == "bootstrap") {
      this.setBootstrapStyles(params.connectBootstrap)
    } else if (params.stylesType == "custom") {
      this.setCustomStyles(params.styles)
    }
  }

  setBootstrapStyles(connect) {
    this.stylesType = "bootstrap"
    if (connect) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha2/css/bootstrap.min.css"
      link.integrity = "sha384-DhY6onE6f3zzKbjUPRc2hOzGAdEf4/Dz+WJwBvEYL/lkkIsI3ihufq9hk9K4lVoK"
      link.crossOrigin = "anonymous"

      const script = document.createElement("script")
      script.src = "https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha2/js/bootstrap.bundle.min.js"
      script.integrity = "sha384-BOsAfwzjNJHrJ8cZidOg56tcQWfp6y72vEJ8xQ9w6Quywb24iOsW913URv1IS4GD"
      script.crossOrigin = "anonymous"

      document.head.prepend(link, script)
    }
  }

  setCustomStyles(styles) {
    this.stylesType = "custom"
    if (styles) {
      const style = document.createElement("style")
      style.innerHTML = styles
      document.head.append(style)
    } else {
      console.error(
        "ScaleOfNums: Ошибка. Вы указали тип стилей 'кастомные', но не передали их в объекте по ключу 'styles'.")
    }
  }

  createScale(min, max, name) {
    const scale = document.createElement("div")
    scale.className = this.stylesType == "bootstrap" ? "d-flex" : "scale-of-nums"

    for (let i = 0; i < (max - min + 1); i++) {
      const idx = i + min

      const label = document.createElement("label")
      label.innerText = idx

      const input = document.createElement("input")
      input.type = "radio"
      input.name = name
      input.value = idx
      input.className = this.stylesType == "bootstrap"
        ? "form-check-input"
        : "scale-of-nums__radio"

      if (this.stylesType == "bootstrap") label.className = "d-flex flex-column align-items-center justify-content-center"
      else label.className = "scale-of-nums__child"
      if (i != 0 && this.stylesType == "bootstrap") label.classList.add("ml-2")

      label.append(input)
      scale.append(label) 
    }

    this.name = name
    this.scale = scale
  }

  getChecked() {
    if (this.name && this.scale) {
      return document.querySelector(`[name=${this.name}]:checked`)
    } else {
      console.error(
        "ScaleOfNums: Ошибка. Шкала не создана, либо вы не придумали название для шкалы в методе 'createScale'")
    }
  }
  
  getCheckedValue() {
    try {
      return this.getChecked().value
    } catch {
      return null
    }
  }

  appendToParent(parent) {
    if (this.scale) {
      parent.append(this.scale)
    } else {
      console.error(
        "ScaleOfNums: Шкала ещё не создана. Для создания воспользуйтесь методом 'createScale'.")
    }
  }

  prependToParent(parent) {
    if (this.scale) {
      parent.prepand(this.scale)
    } else {
      console.error(
        "ScaleOfNums: Шкала ещё не создана. Для создания воспользуйтесь методом 'createScale'.")
    }
  }

  destroy() {
    if (this.scale) {
      this.scale.remove()
    }
  }
}