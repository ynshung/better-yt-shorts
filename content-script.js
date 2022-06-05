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

const getCurrentId = () =>
  document
    .querySelector("#shorts-player > div.html5-video-container > video")
    .closest("ytd-reel-video-renderer").id;

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
      ytTimer.innerHTML = `<p id="ytTimer${currentId}" class="ytTimer"></>`;

      actionList.insertBefore(ytTimer, actionList.children[1]);
      injectedTimer.add(currentId);
      lastTime = 0;
    }
  }
}, 100);

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   console.log(request.url); // new url is now in content scripts!
// });
