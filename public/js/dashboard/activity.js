const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'))
tooltipList = tooltipTriggerList.map(el => new bootstrap.Tooltip(el))

const aboutActivityModalBS = new bootstrap.Modal(aboutActivityModal)
const takeQuestModalBS = new bootstrap.Modal(takeQuestModal)

const schemata = [
  "ежедневно", "через день", "день через два",
  "день через три", "день через четыре", "день через пять", "еженедельно"]

const scale = new ScaleOfNums({ stylesType: "bootstrap" })
scale.createScale(1, 10, "hardScale")
scale.appendToParent(hardDiv)

saveActivityBtn.onclick = () => {
  const activity = activityInp.value
  const measure = measureInp.value
  const schema = +schemaSelect.value
  const hard = +scale.getCheckedValue()
  let err

  if (activity.length < 3 || activity.length > 256) err = `Длина формулировки должна быть от 3 до 256 символов`
  else if (!measure.length) err = `Определи меру`
  else if (!schema) err = "Укажи регулярность"
  else if (!hard) err = "Определи сложность"

  if (err) {
    const alert = new Alert("danger", err)
    alert.show()
  } else {
    fetch(`/api/dashboard/new-activity`, {
      method: "POST",
      body: JSON.stringify({ activity, measure, schema, hard })
    }).then(() => {
      new Alert("success", "Ты успешно добавил действие!").show()
      saveActivityBtn.className = saveActivityBtn.className.replace("danger", "success")
    })
  }
}

function createQuestModal(activity) {
  takeQuestModal.querySelector(".modal-body").innerHTML = /*html*/`
    <div>Ты решаешь: ${activity.activity}, ${activity.measure} (${schemata[activity.schema - 1]}) столько раз:</div>
    <div id="questLengthScale"></div>
    <div class="mt-3">Залог:
      <span class="badge bg-warning text-dark ml-2 mr-2" style="font-size:16px">36</span>
      <span class="text-muted">(срок 9 &times; сложность 4)</span>
    </div>
    <div class="d-flex mt-3 justify-content-around">
      <span class="mr-2">Старт квеста</span>
      <div class="d-flex mr-2">
        <div class="form-check mr-3">
          <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
          <label class="form-check-label" for="flexRadioDefault1">
            Сегодня
          </label>
        </div>
        <div class="form-check mr-3">
          <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2">
          <label class="form-check-label" for="flexRadioDefault2">
            Завтра
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault3">
          <label class="form-check-label" for="flexRadioDefault3">
            Послезавтра
          </label>
        </div>
      </div>
    </div>

    <div id="carouselExampleControls" class="carousel carousel-dark slide" data-ride="carousel">
      <div class="carousel-inner">
        <div class="carousel-item active">
          <div class="calendar" class="mt-3">
            <div class="month">
              <span class="name">Октябрь</span>
              <div>
                <span class="text-muted">26</span>
                <span class="text-muted">27</span>
                <span class="text-muted">28</span>
                <span class="text-muted">29</span>
                <span class="text-muted">30</span>
                <span class="text-muted">31</span>
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
                <span>8</span>
                <span>9</span>
                <span>10</span>
                <span>11</span>
                <span>12</span>
                <span>13</span>
                <span>14</span>
                <span>15</span>
                <span>16</span>
                <span>17</span>
                <span>18</span>
                <span>19</span>
                <span>20</span>
                <span>21</span>
                <span>22</span>
                <span>23</span>
                <span>24</span>
                <span>25</span>
                <span>26</span>
                <span>27</span>
                <span>28</span>
                <span>29</span>
                <span>30</span>
                <span>31</span>
                <span class="text-muted">1</span>
                <span class="text-muted">2</span>
                <span class="text-muted">3</span>
                <span class="text-muted">4</span>
                <span class="text-muted">5</span>
              </div>
            </div>
            <div class="month">
              <span class="name">Ноябрь</span>
              <div>
                <span class="text-muted">26</span>
                <span class="text-muted">27</span>
                <span class="text-muted">28</span>
                <span class="text-muted">29</span>
                <span class="text-muted">30</span>
                <span class="text-muted">31</span>
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
                <span>8</span>
                <span>9</span>
                <span>10</span>
                <span>11</span>
                <span>12</span>
                <span>13</span>
                <span>14</span>
                <span>15</span>
                <span>16</span>
                <span>17</span>
                <span>18</span>
                <span>19</span>
                <span>20</span>
                <span>21</span>
                <span>22</span>
                <span>23</span>
                <span>24</span>
                <span>25</span>
                <span>26</span>
                <span>27</span>
                <span>28</span>
                <span>29</span>
                <span>30</span>
                <span>31</span>
                <span class="text-muted">1</span>
                <span class="text-muted">2</span>
                <span class="text-muted">3</span>
                <span class="text-muted">4</span>
                <span class="text-muted">5</span>
              </div>
            </div>
          </div>
        </div>
        <div class="carousel-item">
          <div class="calendar" class="mt-3">
            <div class="month">
              <span class="name">Декабрь</span>
              <div>
                <span class="text-muted">26</span>
                <span class="text-muted">27</span>
                <span class="text-muted">28</span>
                <span class="text-muted">29</span>
                <span class="text-muted">30</span>
                <span class="text-muted">31</span>
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
                <span>8</span>
                <span>9</span>
                <span>10</span>
                <span>11</span>
                <span>12</span>
                <span>13</span>
                <span>14</span>
                <span>15</span>
                <span>16</span>
                <span>17</span>
                <span>18</span>
                <span>19</span>
                <span>20</span>
                <span>21</span>
                <span>22</span>
                <span>23</span>
                <span>24</span>
                <span>25</span>
                <span>26</span>
                <span>27</span>
                <span>28</span>
                <span>29</span>
                <span>30</span>
                <span>31</span>
                <span class="text-muted">1</span>
                <span class="text-muted">2</span>
                <span class="text-muted">3</span>
                <span class="text-muted">4</span>
                <span class="text-muted">5</span>
              </div>
            </div>
            <div class="month">
              <span class="name">Январь</span>
              <div>
                <span class="text-muted">26</span>
                <span class="text-muted">27</span>
                <span class="text-muted">28</span>
                <span class="text-muted">29</span>
                <span class="text-muted">30</span>
                <span class="text-muted">31</span>
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
                <span>8</span>
                <span>9</span>
                <span>10</span>
                <span>11</span>
                <span>12</span>
                <span>13</span>
                <span>14</span>
                <span>15</span>
                <span>16</span>
                <span>17</span>
                <span>18</span>
                <span>19</span>
                <span>20</span>
                <span>21</span>
                <span>22</span>
                <span>23</span>
                <span>24</span>
                <span>25</span>
                <span>26</span>
                <span>27</span>
                <span>28</span>
                <span>29</span>
                <span>30</span>
                <span>31</span>
                <span class="text-muted">1</span>
                <span class="text-muted">2</span>
                <span class="text-muted">3</span>
                <span class="text-muted">4</span>
                <span class="text-muted">5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </a>
      <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </a>
    </div>
  `

  const scale = new ScaleOfNums({ stylesType: "bootstrap" })
  scale.createScale(1, 30, "quest-length")
  scale.appendToParent(questLengthScale)

  aboutActivityModalBS.hide()
  takeQuestModalBS.show()
}

function aboutModal(activity) {
  aboutActivityModal.querySelector(".modal-body").innerHTML = /*html*/`
    <div>Действие: ${activity.activity}</div>
    <div>Регулярность: ${schemata[activity.schema - 1]}</div>
    <div>Мера: ${activity.measure}</div>
    <div>Сложность: ${activity.hard}</div>
  `

  aboutActivityModalTitle.innerText = activity.activity
  aboutActivityModalBS.toggle()

  takeQuestBtn.onclick = () => createQuestModal(activity)
}

activityList.onclick = e => {
  if (e.target == activityList) return

  const li = e.target.closest("li")
  const { id } = li.dataset

  fetch("/api/get-activity", {
    method: "POST",
    body: JSON.stringify({ id })
  }).then(resp => resp.json()).then(data => {
    aboutModal(data.activity)
  })
}