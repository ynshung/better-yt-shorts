var muted = false;
var volumeState = 0;
var volumeCounter = 1;
var actualVolume = 0;
var mouseX;

document.addEventListener("keydown", (data) => {
  if (
    document.activeElement === document.querySelector(`input`) ||
    document.activeElement === document.querySelector('#contenteditable-root')
    ) return; // Avoids using keys while the user interacts with any input, like search and comment.
  const ytShorts = document.querySelector(
    "#shorts-player > div.html5-video-container > video"
  );
  const key = data.key.toLowerCase();
  switch (key) {
    case "j":
      ytShorts.currentTime -= 5;
      break;

    case "l":
      ytShorts.currentTime += 5;
      break;

    case "u":
      if (ytShorts.playbackRate > 0.25) ytShorts.playbackRate -= 0.25;
      break;

    case "i":
      ytShorts.playbackRate = 1;
      break;

    case "o":
      if (ytShorts.playbackRate < 16) ytShorts.playbackRate += 0.25;
      break;

    case "+":
      if (ytShorts.volume <= 0.975) {
        setVolume(ytShorts.volume + 0.025);
      }
      break;

    case "-":
      if (ytShorts.volume >= 0.025) {
        setVolume(ytShorts.volume - 0.025);
      }
      break;

    case "m":
      if (!muted) {
        muted = true;
        volumeState = ytShorts.volume;
        ytShorts.volume = 0;
      } else {
        muted = false;
        ytShorts.volume = volumeState;
      }
      break;
  }
  setSpeed = ytShorts.playbackRate;
});

const getCurrentId = () => {
  const videoEle = document.querySelector(
    "#shorts-player > div.html5-video-container > video"
  );
  if (videoEle) return videoEle.closest("ytd-reel-video-renderer").id;
  return null;
};

const getActionElement = (id) =>
  document.querySelector(
    `[id='${id}']  > div.overlay.style-scope.ytd-reel-video-renderer > ytd-reel-player-overlay-renderer > #actions`
  );

const getOverlayElement = (id) =>
  document.querySelector(
    `[id='${id}']  > div.overlay.style-scope.ytd-reel-video-renderer > ytd-reel-player-overlay-renderer > #overlay`
);

const setTimer = (currTime, duration) => {
  document.getElementById(
    `ytTimer${getCurrentId()}`
  ).innerText = `${currTime}/${duration}s`;
};

const setVolumeSlider = () => {
  let index = parseFloat(getCurrentId()) + volumeCounter;
  const volumeContainer = document.querySelectorAll(`yt-icon-button.style-scope.ytd-shorts-player-controls`)[index].parentNode;
  const slider = document.createElement('input');
  if(!actualVolume){
    actualVolume = 0.5;
  }
  checkVolume();
  slider.id = "volumeSliderController";
  slider.classList.add("volumeSlider");
  slider.type = 'range';
  slider.min = 0;
  slider.max = 1;
  slider.step = 0.01;
  volumeContainer.appendChild(slider);
  slider.value = actualVolume;

  slider.addEventListener("input", (data) => {
    data.stopPropagation();
    data.preventDefault();
    data.stopImmediatePropagation();

    setVolume(data.target.value);
  });
  volumeCounter++;
};

const setVolume = (volume) => {
  const volumeContainer = document.querySelectorAll(`yt-icon-button.style-scope.ytd-shorts-player-controls`)[parseFloat(getCurrentId())+(volumeCounter-1)].parentNode;
  const volumeSliderController = volumeContainer.children.volumeSliderController;
  volumeSliderController.value = volume;

  const ytShorts = document.querySelector(
      "#shorts-player > div.html5-video-container > video"
  );
  ytShorts.volume = volume;
  localStorage.setItem("yt-player-volume",`{
      "data": {\"volume\":`+volume+`,\"muted\":`+muted+`}
    }`)
}

const checkVolume = () => {
  let ytShorts = document.querySelector(
      "#shorts-player > div.html5-video-container > video"
  );
  if(JSON.parse(localStorage.getItem("yt-player-volume"))["data"]["volume"]){
    actualVolume = JSON.parse(localStorage.getItem("yt-player-volume"))["data"]["volume"];
    ytShorts.volume = actualVolume;
  }else{
    actualVolume = ytShorts.volume;
  }
};

const setPlaybackRate = (currSpeed) => {
  document.getElementById(
    `ytPlayback${getCurrentId()}`
  ).innerText = `${currSpeed}x`;
};

var injectedItem = new Set();
var lastTime = -1;
var lastSpeed = 0;
var setSpeed = 1;

const timer = setInterval(() => {
  if (!window.location.toString().indexOf("youtube.com/shorts/")) return;
  const ytShorts = document.querySelector(
    "#shorts-player > div.html5-video-container > video"
  );
  var currentId = getCurrentId();
  var actionList = getActionElement(currentId);
  var overlayList = getOverlayElement(currentId);

  if (injectedItem.has(currentId)) {
    var currTime = Math.round(ytShorts.currentTime);
    var currSpeed = ytShorts.playbackRate;

    if (currTime !== lastTime) {
      setTimer(currTime, Math.round(ytShorts.duration || 0));
      lastTime = currTime;
    }
    if (currSpeed != lastSpeed) {
      setPlaybackRate(currSpeed);
      lastSpeed = currSpeed;
    }
  } else {
    lastTime = -1;
    lastSpeed = 0;

    if (actionList) {
      //Container div
      const timerContainer = document.createElement("div");
      timerContainer.classList.add("betterYT-container");
      // Timer
      const ytTimer = document.createElement("div");
      var para0 = document.createElement("p");
      para0.classList.add("betterYT", "yt-spec-button-shape-with-label__label");
      para0.id = `ytTimer${currentId}`;
      ytTimer.appendChild(para0);

      // Playback Rate
      const ytPlayback = document.createElement("div");
      var para1 = document.createElement("p");
      para1.classList.add("betterYT");
      para1.classList.add("playBack");
      para1.id = `ytPlayback${currentId}`;
      ytPlayback.appendChild(para1);

      timerContainer.appendChild(ytPlayback);
      actionList.insertBefore(timerContainer, actionList.children[1]);
      actionList.insertBefore(ytTimer, actionList.children[2]);
      injectedItem.add(currentId);

      ytShorts.playbackRate = setSpeed;
      setPlaybackRate(setSpeed);
      setTimer(currTime || 0, Math.round(ytShorts.duration || 0));

      timerContainer.addEventListener("click",(data) => {
          ytShorts.playbackRate = 1;
          setSpeed = ytShorts.playbackRate;
      });
    }
    
    // Progress bar
    if (overlayList) {
      var progBarList = overlayList.children[2].children[0].children[0];
      var progBarBG = progBarList.children[0];
      var progBarPlayed = progBarList.children[1]; // The red part of the progress bar

      // Force progress bar to be visible for sub-30s shorts
      if (ytShorts.duration < 30) {
        progBarList.removeAttribute("hidden"); 
      }

      const timestampTooltip = document.createElement("div");
      timestampTooltip.classList.add("betterYT-timestamp-tooltip");

      progBarList.appendChild(timestampTooltip);

      // Styling to ensure rest of bottom overlay (shorts title/sub button) stay in place
      overlayList.children[0].style.marginBottom = "-8px";
      progBarList.style.height = "11px";
      progBarList.style.paddingTop = "2px"; // Slight padding to increase hover box

      progBarList.classList.add('betterYT-progress-bar');
      progBarBG.classList.add('betterYT-progress-bar');
      progBarPlayed.classList.add('betterYT-progress-bar');

      overlayList.addEventListener("mouseover", () => {
        progBarBG.classList.add('betterYT-progress-bar-hover-overlay');
        progBarPlayed.classList.add('betterYT-progress-bar-hover-overlay');
      });
      overlayList.addEventListener("mouseout", () => {
        progBarBG.classList.remove('betterYT-progress-bar-hover-overlay');
        progBarPlayed.classList.remove('betterYT-progress-bar-hover-overlay');
      });

      progBarList.addEventListener("mouseover", () => {
        progBarBG.classList.add('betterYT-progress-bar-hover');
        progBarPlayed.classList.add('betterYT-progress-bar-hover');
      });
      progBarList.addEventListener("mousemove", (event) => {
        let x = event.clientX - progBarList.getBoundingClientRect().left;
        // Deal with slight inaccuracies
        if (x < 0) x = 0;
        if (x > progBarList.clientWidth) x = progBarList.clientWidth;
        // Get timestamp and round to nearest 0.1
        let timestamp = ((x / progBarList.clientWidth) * ytShorts.duration).toFixed(1);
        timestampTooltip.textContent = `${timestamp}s`;
        // Ensure tooltip stays visible at edges of client
        if ((x - (timestampTooltip.offsetWidth / 2)) > (progBarList.clientWidth - timestampTooltip.offsetWidth)) {
          timestampTooltip.style.left = `${progBarList.clientWidth - timestampTooltip.offsetWidth}px`;
        } else if ((x - (timestampTooltip.offsetWidth / 2)) <= 0) {
          timestampTooltip.style.left = "0px";
        } else {
          timestampTooltip.style.left = `${x - (timestampTooltip.offsetWidth / 2)}px`;
        }
        timestampTooltip.style.top = "-20px";
        timestampTooltip.style.display = 'block';
      });
      progBarList.addEventListener("mouseout", () => {
        progBarBG.classList.remove('betterYT-progress-bar-hover');
        progBarPlayed.classList.remove('betterYT-progress-bar-hover');
        timestampTooltip.style.display = 'none';
      });
      progBarList.addEventListener("click", (event) => {
        let x = event.clientX - progBarList.getBoundingClientRect().left;
        if (x < 0) x = 0;
        if (x > progBarList.clientWidth) x = progBarList.clientWidth;
        ytShorts.currentTime = (x / progBarList.clientWidth) * ytShorts.duration;
      });
    }
    setVolumeSlider();
  }
  checkVolume();
}, 100);
