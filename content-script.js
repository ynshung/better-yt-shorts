const ytShorts = () =>
  document.querySelector("#shorts-player > div.html5-video-container > video");

document.addEventListener("keydown", (data) => {
  const key = data.key.toLowerCase();
  switch (key) {
    case "j":
      ytShorts().currentTime -= 5;
      break;

    case "l":
      ytShorts().currentTime += 5;
      break;

    default:
      break;
  }
});

const getCurrentId = () =>{
    const videoEle = document.querySelector("#shorts-player > div.html5-video-container > video");
    if (videoEle) return videoEle.closest("ytd-reel-video-renderer").id;
    return null;
}

const getActionElement = (id) =>
  document.querySelector(
    `[id='${id}']  > div.overlay.style-scope.ytd-reel-video-renderer > ytd-reel-player-overlay-renderer > #actions`
  );

const setTimer = (currTime, duration) => {
  document.getElementById(
    `ytTimer${getCurrentId()}`
  ).innerText = `${currTime}/${duration}s`;
};

var injectedTimer = new Set();
var lastTime = 0;

const timer = setInterval(() => {
  var currentId = getCurrentId();
  var actionList = getActionElement(currentId);

  if (injectedTimer.has(currentId)) {
    var currTime = Math.round(ytShorts().currentTime);
    if (currTime !== lastTime) {
      setTimer(currTime, Math.round(ytShorts().duration));
      lastTime = currTime;
    }
  } else {
    if (actionList) {
      const ytTimer = document.createElement("div");
      const para = document.createElement("p");
      para.classList.add("ytTimer");
      para.id = `ytTimer${currentId}`;
      ytTimer.appendChild(para);

      actionList.insertBefore(ytTimer, actionList.children[1]);
      injectedTimer.add(currentId);
      lastTime = 0;
    }
  }
}, 100);
