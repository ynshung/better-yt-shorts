const storage = (typeof browser === 'undefined') ? chrome.storage.local : browser.storage.local;
var muted = false;
var volumeState = 0;
var actualVolume = 0;

// Using localStorage as a fallback for browser/chrome.storage.local
var keybinds = JSON.parse(localStorage.getItem("yt-keybinds"));
storage.get(["keybinds"])
.then((result) => {
  if (result.keybinds) {
    if (result.keybinds !== keybinds) localStorage.setItem("yt-keybinds", JSON.stringify(result.keybinds));
    keybinds = result.keybinds;
  }
});

document.addEventListener("keydown", (data) => {
  if (
    document.activeElement === document.querySelector(`input`) ||
    document.activeElement === document.querySelector("#contenteditable-root")
    ) return; // Avoids using keys while the user interacts with any input, like search and comment.
  const ytShorts = document.querySelector(
    "#shorts-player > div.html5-video-container > video"
  );
  if (!ytShorts) return;
  if (!keybinds) keybinds = {'Seek Backward': 'arrowleft','Seek Forward': 'arrowright','Decrease Speed': 'u','Reset Speed': 'i','Increase Speed': 'o','Decrease Volume': '-','Increase Volume': '+','Toggle Mute': 'm'};
  const key = data.key.toLowerCase();
  let command;
  for (const [cmd, keybind] of Object.entries(keybinds)) if (key === keybind) command = cmd;
  if (!command) return;
  switch (command) {
    case "Seek Backward":
      ytShorts.currentTime -= 5;
      break;

    case "Seek Forward":
      ytShorts.currentTime += 5;
      break;

    case "Decrease Speed":
      if (ytShorts.playbackRate > 0.25) ytShorts.playbackRate -= 0.25;
      break;

    case "Reset Speed":
      ytShorts.playbackRate = 1;
      break;

    case "Increase Speed":
      if (ytShorts.playbackRate < 16) ytShorts.playbackRate += 0.25;
      break;

    case "Increase Volume":
      if (ytShorts.volume <= 0.975) {
        setVolume(ytShorts.volume + 0.025);
      }
      break;

    case "Decrease Volume":
      if (ytShorts.volume >= 0.025) {
        setVolume(ytShorts.volume - 0.025);
      }
      break;

    case "Toggle Mute":
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
  if (videoEle && videoEle.closest("ytd-reel-video-renderer")) return videoEle.closest("ytd-reel-video-renderer").id;
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

const getVolumeContainer = (id) =>
  document.querySelector(
    `[id='${id}']  > #player-container > div.player-controls.style-scope.ytd-reel-video-renderer > ytd-shorts-player-controls.style-scope.ytd-reel-video-renderer`
  );

const getNextButton = () =>
  document.querySelector('button.yt-spec-button-shape-next[aria-label="Next video"]');

const setTimer = (currTime, duration) => {
  const id = getCurrentId();
  if (document.getElementById(`ytTimer${id}`) === null) return false;
  document.getElementById(
    `ytTimer${id}`
  ).innerText = `${currTime}/${duration}s`;
  return true
};

const setVolumeSlider = (ytShorts, id) => {
  const volumeContainer = getVolumeContainer(id);
  const slider = document.createElement("input");
  if(!actualVolume) actualVolume = 0.5;
  checkVolume(ytShorts);
  slider.id = `volumeSliderController${id}`;
  slider.classList.add("volume-slider");
  slider.classList.add("betterYT-volume-slider");
  slider.type = "range";
  slider.min = 0;
  slider.max = 1;
  slider.step = 0.01;
  slider.setAttribute("orient", "vertical");
  volumeContainer.appendChild(slider);
  slider.value = actualVolume;

  slider.addEventListener("input", (data) => {
    setVolume(data.target.value);
  });

  // Prevent video from pausing/playing on click
  slider.addEventListener("click", (data) => {
    data.stopPropagation();
  });
};

const setVolume = (volume) => {
  const id = getCurrentId()
  const volumeSliderController = document.getElementById(`volumeSliderController${id}`);
  volumeSliderController.value = volume;

  const ytShorts = document.querySelector(
      "#shorts-player > div.html5-video-container > video"
  );
  ytShorts.volume = volume;
  localStorage.setItem("yt-player-volume",`{
      "data": {\"volume\":`+volume+`,\"muted\":`+muted+`}
    }`)
}

const checkVolume = (ytShorts) => {
  if(JSON.parse(localStorage.getItem("yt-player-volume"))["data"]["volume"]){
    actualVolume = JSON.parse(localStorage.getItem("yt-player-volume"))["data"]["volume"];
    ytShorts.volume = actualVolume;
  }else{
    actualVolume = ytShorts.volume;
  }
};

const setPlaybackRate = (currSpeed) => {
  const id = getCurrentId();
  if (document.getElementById(`ytPlayback${id}`) === null) return false;
  document.getElementById(
    `ytPlayback${getCurrentId()}`
  ).innerText = `${currSpeed}x`;
  return true
};

function video() { return document.querySelector("#shorts-player>div>video"); }

//WheelProgram
function wheel(Element, codeA, codeB) {
    Element.addEventListener("mousewheel", (event) => {
        if (event.wheelDelta > 0) {
            codeA();
        } else {
            codeB();
        }
        event.preventDefault();
    },
        { passive: false }
    );
}

var injectedItem = new Set();
var lastTime = -1;
var lastSpeed = 0;
var setSpeed = 1;

const timer = setInterval(() => {
  if (window.location.toString().indexOf("youtube.com/shorts/") < 0) return;
  const ytShorts = document.querySelector(
    "#shorts-player > div.html5-video-container > video"
  );
  var currentId = getCurrentId();
  var actionList = getActionElement(currentId);
  var overlayList = getOverlayElement(currentId);
  var autoplayEnabled = localStorage.getItem("yt-autoplay") === "true" ? true : false;
  if (autoplayEnabled === null) autoplayEnabled = false;

  if (injectedItem.has(currentId)) {
    var currTime = Math.round(ytShorts.currentTime);
    var currSpeed = ytShorts.playbackRate;

    if (autoplayEnabled && ytShorts && ytShorts.currentTime >= ytShorts.duration - 0.11) {
      var nextButton = getNextButton();
      nextButton.click();
    }

    if (currTime !== lastTime) {
      // Using this as a check whether the elements actually were injected on the page
      var injectedSuccess = setTimer(currTime, Math.round(ytShorts.duration || 0));
      // If failed, retry injection during next interval
      if (!injectedSuccess) injectedItem.delete(currentId);
      lastTime = currTime;
    }
    if (currSpeed != lastSpeed) {
      const setRateSuccess = setPlaybackRate(currSpeed);
      if (setRateSuccess) lastSpeed = currSpeed;
    }

  } else {
    lastTime = -1;
    lastSpeed = 0;
    if (autoplayEnabled && ytShorts) ytShorts.loop = false;

    if (actionList) {

      const betterYTContainer = document.createElement("div");
      betterYTContainer.id = "betterYT-container";
      betterYTContainer.setAttribute("class", "button-container style-scope ytd-reel-player-overlay-renderer");

      const ytdButtonRenderer = document.createElement("div");
      ytdButtonRenderer.setAttribute("class", "betterYT-renderer style-scope ytd-reel-player-overlay-renderer");

      const ytButtonShape = document.createElement("div");
      ytButtonShape.setAttribute("class", "betterYT-button-shape");

      const ytLabel = document.createElement("label");
      ytLabel.setAttribute("class", "yt-spec-button-shape-with-label");

      const ytButton = document.createElement("button");      
      ytButton.setAttribute("class", "yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-l yt-spec-button-shape-next--icon-button ");
      // Playback Rate
      var para0 = document.createElement("p");
      para0.classList.add("betterYT");
      para0.id = `ytPlayback${currentId}`;

      // Timer
      const ytTimer = document.createElement("div");
      ytTimer.classList.add("yt-spec-button-shape-with-label__label");
      var span1 = document.createElement("span");
      span1.setAttribute("class", "yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--text-alignment-center yt-core-attributed-string--word-wrapping");
      span1.id = `ytTimer${currentId}`;
      span1.setAttribute("role", "text");
      ytTimer.appendChild(span1);

      // Match YT's HTML structure
      ytButton.appendChild(para0);
      ytLabel.appendChild(ytButton);
      ytLabel.appendChild(ytTimer);
      ytButtonShape.appendChild(ytLabel);
      ytdButtonRenderer.appendChild(ytButtonShape);
      betterYTContainer.appendChild(ytdButtonRenderer);

      actionList.insertBefore(betterYTContainer, actionList.children[1]);

      // Autoplay Switch
      const switchContainer = document.createElement("div");
      const autoplaySwitch = document.createElement("label");
      autoplaySwitch.classList.add("autoplay-switch");
      var checkBox = document.createElement("input");
      checkBox.type = "checkbox";
      checkBox.id = `autoplay-checkbox${currentId}`;
      checkBox.checked = autoplayEnabled;
      var autoplaySpan = document.createElement("span");
      autoplaySpan.classList.add("autoplay-slider");
      autoplaySwitch.append(checkBox, autoplaySpan);
      switchContainer.appendChild(autoplaySwitch);

      actionList.insertBefore(switchContainer, actionList.children[1]);
      
      const autoplayTitle = document.createElement("div");
      autoplayTitle.classList.add("yt-spec-button-shape-with-label__label");
      var span2 = document.createElement("span");
      span2.setAttribute("class", "betterYT-auto yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--text-alignment-center");
      span2.setAttribute("role", "text");
      span2.textContent = "Autoplay";
      autoplayTitle.appendChild(span2);
    
      actionList.insertBefore(autoplayTitle, actionList.children[2]);
      injectedItem.add(currentId);

      ytShorts.playbackRate = setSpeed;
      setPlaybackRate(setSpeed);
      injectedSuccess = setTimer(currTime || 0, Math.round(ytShorts.duration || 0));

      betterYTContainer.addEventListener("click",() => {
        ytShorts.playbackRate = 1;
        setSpeed = ytShorts.playbackRate;
      });

      checkBox.addEventListener('change', () => {
        if (checkBox.checked) {
          localStorage.setItem("yt-autoplay", "true");
          ytShorts.loop = false;
        } else {
          localStorage.setItem("yt-autoplay", "false");
          ytShorts.loop = true;
        }
      });

      wheel(ytButton, speedup, speeddown);
      function speedup() {
        if (ytShorts.playbackRate < 16) video().playbackRate += 0.25;
        setSpeed = video().playbackRate;
      }
      function speeddown() {
        if (ytShorts.playbackRate > 0.25) video().playbackRate -= 0.25;
        setSpeed = video().playbackRate;
      }
      wheel(ytTimer, forward, backward);
      function forward() {
        video().currentTime += 1;
      }
      function backward() {
        video().currentTime -= 1;
      }

    }
    // Progress bar
    if (overlayList) {
      var progBarList = overlayList.children[2].children[0].children[0];
      var progBarBG = progBarList.children[0];
      var progBarPlayed = progBarList.children[1]; // The red part of the progress bar

      // Force progress bar to be visible for sub-30s shorts
      if (ytShorts.duration < 30) progBarList.removeAttribute("hidden"); 

      const timestampTooltip = document.createElement("div");
      timestampTooltip.classList.add("betterYT-timestamp-tooltip");

      progBarList.appendChild(timestampTooltip);

      // Styling to ensure rest of bottom overlay (shorts title/sub button) stay in place
      overlayList.children[0].style.marginBottom = "-7px";
      progBarList.style.height = "10px";
      progBarList.style.paddingTop = "2px"; // Slight padding to increase hover box

      progBarList.classList.add('betterYT-progress-bar');
      progBarBG.classList.add('betterYT-progress-bar');
      progBarPlayed.classList.add('betterYT-progress-bar');

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
    if (currentId !== null) setVolumeSlider(ytShorts, currentId);
  }
  if (ytShorts) checkVolume(ytShorts);
}, 100);