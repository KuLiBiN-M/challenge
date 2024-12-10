class TimerApp {
  constructor() {
    this.timeInput = document.getElementById("time-input");
    this.addTimerButton = document.getElementById("add-timer");
    this.timersList = document.getElementById("timers");
    this.errorMessage = document.getElementById("error-message");
    this.handleAddTimer = this.handleAddTimer.bind(this);
    this.addTimerButton.addEventListener("click", this.handleAddTimer);
  }

  // Проверка корректности времени
  validateInput(value) {
    const duration = parseInt(value, 10);
    if (isNaN(duration) || duration <= 0) {
      this.showError("Введите корректное время в секундах!");
      return null;
    }
    return duration;
  }

  // Показываем сообщение об ошибке
  showError(message) {
    this.errorMessage.textContent = message;
    this.errorMessage.classList.add("show");    
    setTimeout(() => {
      this.errorMessage.classList.remove("show");
    }, 3000);
  }
    
  // Метод для обработки добавления нового таймера
  handleAddTimer() {
    const duration = this.validateInput(this.timeInput.value);
    if (duration === null) return;
    this.createTimer(duration);
    this.timeInput.value = "";
  }

  // Метод для создания нового таймера
  createTimer(duration) {
    let remainingTime = duration;
    let isRunning = true;

    // Создаем элементы DOM для таймера
    const timerItem = document.createElement("li");
    const timeDisplay = document.createElement("span");
    const stopButton = document.createElement("button");
    const toggleButton = document.createElement("button");

    timeDisplay.textContent = `${remainingTime} сек`;
    stopButton.textContent = "Удалить";
    toggleButton.textContent = "Остановить";

    timerItem.appendChild(timeDisplay);
    timerItem.appendChild(toggleButton);
    timerItem.appendChild(stopButton);
    this.timersList.appendChild(timerItem);

    // Привязываем контекст к методам внутри замыкания
    const updateTimer = () => {
      if (!isRunning) return;

      if (remainingTime <= 0) {
        clearInterval(intervalId);
        timerItem.remove();
      } else {
        remainingTime--;
        timeDisplay.textContent = `${remainingTime} сек`;
      }
    };

    const intervalId = setInterval(updateTimer, 1000);

    // Управление состоянием таймера
    toggleButton.addEventListener("click", () => {
      isRunning = !isRunning;
      toggleButton.textContent = isRunning ? "Остановить" : "Продолжить";
    });

    // Удаление таймера
    stopButton.addEventListener("click", () => {
      clearInterval(intervalId);
      timerItem.remove();
    });
  }
}

// Инициализация приложения
document.addEventListener("DOMContentLoaded", () => {
  new TimerApp();
});
