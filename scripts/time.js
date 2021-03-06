const timeStamp = $(".timestamp");
const startBtn = $(".pomodoro__box .start");
const stopBtn = $(".pomodoro__box .stop");
const skipBtn = $(".pomodoro__box .skip");
const pomodoroMode = $(".period .study");
const shortBreakMode = $(".period .s-break");
const longBreakMode = $(".period .l-break");
const pomodoroDuration = $(".pomodoro-duration .setting-input");
const shortBreakDuration = $(".short-duration .setting-input");
const longBreakDuration = $(".long-duration .setting-input");
const acceptSettingBtn = $(".setting__modal .setting-btn");
const treeImage = $(".pomodoro .circle .image");
const timeUpAudio = $(".time-up");
let isCountDown = false;
let countDown,
  imageIndex = 0;
let countBreak = 0;

// default value
let time, startingMinutes;
let mode = "pomodoro";
stopBtn.classList.toggle("hidden");
skipBtn.classList.add("hidden");

// Time Countdown (3 modes)
pomodoroMode.addEventListener("click", function () {
  mode = "pomodoro";
  pomodoroSettingTime();
  stopCountDown();
});
shortBreakMode.addEventListener("click", function () {
  mode = "shortbreak";
  shortBreakSettingTime();
  stopCountDown();
});
longBreakMode.addEventListener("click", function () {
  mode = "longbreak";
  longBreakSettingTime();
  stopCountDown();
});

// when click start
startBtn.addEventListener("click", function () {
  isCountDown = true;
  startCountDown();
});
// when click stop
stopBtn.addEventListener("click", function () {
  isCountDown = false;
  stopCountDown();
});
// when click skip
skipBtn.addEventListener("click", function () {
  time = 0;
  setTimeout(stopCountDown, 1000);
});

// FUNCTION
// add time html and setting countDown time
function pomodoroSettingTime() {
  const pomoDura = $(".pomodoro-duration .setting-input").value;
  timeStamp.innerHTML = `${pomoDura}:00`;
  document.title = `PomoTree - ${pomoDura}:00`;
  startingMinutes = Math.ceil(Number(pomoDura));
  time = startingMinutes * 60;
  pomodoroMode.classList.add("active");
  shortBreakMode.classList.remove("active");
  longBreakMode.classList.remove("active");
  imageIndex = 0;
  processInput();
  changeTreeImage(imageIndex);
}
function shortBreakSettingTime() {
  const shortDura = $(".short-duration .setting-input").value;
  timeStamp.innerHTML = `${shortDura}:00`;
  document.title = `PomoTree - ${shortDura}:00`;
  startingMinutes = Math.ceil(Number(shortDura));
  time = startingMinutes * 60;
  pomodoroMode.classList.remove("active");
  shortBreakMode.classList.add("active");
  longBreakMode.classList.remove("active");
  processInput();
  changeShortBreakImage();
}
function longBreakSettingTime() {
  const longDura = $(".long-duration .setting-input").value;
  timeStamp.innerHTML = `${longDura}:00`;
  document.title = `PomoTree - ${longDura}:00`;
  startingMinutes = Math.ceil(Number(longDura));
  time = startingMinutes * 60;
  pomodoroMode.classList.remove("active");
  shortBreakMode.classList.remove("active");
  longBreakMode.classList.add("active");
  processInput();
  changeLongBreakImage();
}
// start and stop countdown function
function startCountDown() {
  countDown = setInterval(updateCountdown, 1000);
  startBtn.classList.add("hidden");
  stopBtn.classList.remove("hidden");
  skipBtn.classList.remove("hidden");
}
function stopCountDown() {
  clearInterval(countDown);
  startBtn.classList.remove("hidden");
  stopBtn.classList.add("hidden");
  skipBtn.classList.add("hidden");
}
function updateCountdown() {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60 < 10 ? "0" + (time % 60) : time % 60;
  time--;
  // Progress CountDown
  let progressPercent =
    ((startingMinutes * 60 - time) * 100) / (startingMinutes * 60);
  checkProgress(progressPercent);
  timeStamp.innerHTML = `${minutes}:${seconds}`;
  document.title = `PomoTree - ${minutes}:${seconds}`;
  //When countDown = 0;
  if (time === -1) {
    timeUpAudio.play();
    if (mode == "pomodoro") {
      plantOneTree();
      countBreak += 1;
      if (countBreak >= 3) {
        mode = "longbreak";
        countBreak = 0;
        longBreakSettingTime();
        toast({
          title: "Long Break Time",
          messenger: `It's time to have a long break`,
          type: "success",
          duration: 2000,
        });
      } else {
        mode = "shortbreak";
        shortBreakSettingTime();
        toast({
          title: "Short Break Time",
          messenger: `It's time to have a short break`,
          type: "warning",
          duration: 2000,
        });
      }
    } else if (mode == "shortbreak" || mode == "longbreak") {
      mode = "pomodoro";
      pomodoroSettingTime();
      toast({
        title: "Study Time",
        messenger: `It's time to study`,
        type: "error",
        duration: 2000,
      });
    }
  }
}

// check progress to change image
function checkProgress(percent) {
  let percentRound = Math.floor(percent);
  let index = Math.floor(percentRound / 4);
  if (imageIndex != index && mode == "pomodoro") {
    imageIndex = index;
    changeTreeImage(imageIndex);
  } else if (mode == "shortbreak") {
    changeShortBreakImage();
  } else if (mode == "longbreak") {
    changeLongBreakImage();
  }
}

function changeTreeImage(index) {
  if (index > 25) index = 25;
  treeImage.style.backgroundImage = `url(./images/tree/tree-${index}.png)`;
}
function changeShortBreakImage() {
  treeImage.style.backgroundImage = `url(./images/tree/tree-25.png)`;
}
function changeLongBreakImage() {
  treeImage.style.backgroundImage = `url(./images/panda.gif)`;
}
function plantOneTree() {
  $(".profile-tree .amount").value =
    Number($(".profile-tree .amount").value) + 1;
}

// dynamic time countdown html (Auto font size)
const outputContainer = $(".pomodoro__box .box");
function resize_to_fit() {
  let fontSize = window.getComputedStyle(timeStamp).fontSize;
  while (timeStamp.clientWidth >= outputContainer.clientWidth - 20) {
    fontSize = window.getComputedStyle(timeStamp).fontSize;
    timeStamp.style.fontSize = parseFloat(fontSize) - 2 + "px";
  }
}
function processInput() {
  timeStamp.style.fontSize = "80px"; // Default font size
  resize_to_fit();
}
