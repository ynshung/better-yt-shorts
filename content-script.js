const defaultKeybinds = {
  'Seek Backward':   'ArrowLeft',
  'Seek Forward':    'ArrowRight',
  'Decrease Speed':  'KeyU',
  'Reset Speed':     'KeyI',
  'Increase Speed':  'KeyO',
  'Decrease Volume': 'Minus',
  'Increase Volume': 'Equal',
  'Toggle Mute':     'KeyM',
  'Next Frame':      'Comma',
  'Previous Frame':  'Period',
  'Next Short': 'KeyS', 
  'Previous Short': 'KeyW',
};
const defaultExtraOptions = {
  skip_enabled:   false,
  skip_threshold: 500,
  automatically_open_comments: false,
  seek_amount: 5,
}
const storage = (typeof browser === 'undefined') ? chrome.storage.local : browser.storage.local;
var muted = false;
var volumeState = 0;
var actualVolume = 0;
var skippedId = null
var topId = 0 // store the furthest id in the chain

// video with no likes    => https://www.youtube.com/shorts/ZFLRydDd9Mw
// video with no likes and 23k comments => https://www.youtube.com/shorts/gISsypl5xsc
// another                => https://www.youtube.com/shorts/qe56pgRVrgE?feature=share
// video with 1.5M / 1,5M => https://www.youtube.com/shorts/nKZIx1bHUbQ

function openComments()
{
  getCommentsButton().click()
}
function shouldOpenComments()
{
  if ( extraOptions === null )                       return false
  if ( !extraOptions.automatically_open_comments )   return false
  if ( getCurrentId() === skippedId )                return false // prevents opening comments on skipped shorts
  if ( isCommentsPanelOpen() )                       return false

  return true
}

function shouldSkipShort( currentId, likeCount )
{
  // for debugging purposes

  // console.dir({
  //   "extra options check": !( extraOptions == null ),
  //   "video playing check": !( getVideo().currentTime === 0 ),
  //   "option enabled?": !( !extraOptions.skip_enabled ),
  //   "current id check": !( currentId < topId ),
  //   "skipped id check": !( skippedId === currentId ),
  //   "likecount null check": !( likeCount === null || isNaN( likeCount ) ),
  //   "threshold check": !( likeCount >= extraOptions.skip_threshold ),
  //   "current threshold": extraOptions.skip_threshold,
  //   "number of likes": likeCount
  // })

  if ( extraOptions === null )                    return false
  if ( getVideo().currentTime === 0 )             return false // video unstarted, likes likely not loaded

  if ( !extraOptions.skip_enabled )               return false
  if ( currentId < topId )                        return false // allow user to scroll back up to see skipped video
  if ( skippedId === currentId )                  return false // prevent skip spam
  if ( likeCount === null || isNaN( likeCount ) ) return false // dont skip unloaded shorts
  if ( likeCount >= extraOptions.skip_threshold )  return false
  return true
}

const getCommentsButton = () =>
  document.querySelector( `[ id="${getCurrentId()}" ] #comments-button .yt-spec-touch-feedback-shape__fill` )
  
function isCommentsPanelOpen()
{
  // return true if the selector finds an open panel
  // if panel is unfound, then the short either hasnt loaded, or the panel is not open
  return document.querySelector( `[ id="${getCurrentId()}" ] #watch-while-engagement-panel  [ visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED" ]` ) ?? false
}
  
// fixed mac scroll issue
function skipShort( short )
{
  var nextButton = getNextButton();
  nextButton.click();
}

// Using localStorage as a fallback for browser/chrome.storage.local
var keybinds = JSON.parse(localStorage.getItem("yt-keybinds"));
storage.get(["keybinds"])
.then((result) => {
  if (result.keybinds) {
    // Set default keybinds if not exists
    for (const [cmd, keybind] of Object.entries(defaultKeybinds)) {
      if (!result.keybinds[cmd]) result.keybinds[cmd] = keybind;
    }
    if (result.keybinds !== keybinds) localStorage.setItem("yt-keybinds", JSON.stringify(result.keybinds));
    keybinds = result.keybinds;
  }
});

var extraOptions = JSON.parse(localStorage.getItem("yt-extraopts"))
storage.get( ["extraopts"] )
  .then((result) => {
    if (result.extraopts) 
    {
      // Set default options if not exists
      for ( const [ option, value ] of Object.entries( defaultExtraOptions ) ) {
        if ( result.extraopts[ option ] ) continue
        result.extraopts[ option ] = value
      }

      if ( result.extraopts !== extraOptions ) 
        localStorage.setItem("yt-extraopts", JSON.stringify(result.extraopts) )

      extraOptions = result.extraopts
    }
  })

document.addEventListener("keydown", (data) => {
  if (
    document.activeElement === document.querySelector(`input`) ||
    document.activeElement === document.querySelector("#contenteditable-root")
    ) return; // Avoids using keys while the user interacts with any input, like search and comment.
  const ytShorts = getVideo();
  if (!ytShorts) return;
  if (!keybinds) keybinds = defaultKeybinds;

  const key    = data.code;
  const keyAlt = data.key.toLowerCase(); // for legacy keybinds

  let command;
  for ( const [cmd, keybind] of Object.entries(keybinds) ) 
    if ( key === keybind || keyAlt === keybind ) 
      command = cmd;

  if (!command) return;
  
  switch (command) {
    case "Seek Backward":
      ytShorts.currentTime -= extraOptions?.seek_amount ?? defaultExtraOptions.seek_amount;
      break;

    case "Seek Forward":
      ytShorts.currentTime += extraOptions?.seek_amount ?? defaultExtraOptions.seek_amount;
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
      
    case "Next Frame":
      if (ytShorts.paused) {
        ytShorts.currentTime -= 0.04;
      }
      break;

    case "Previous Frame":
      if (ytShorts.paused) {
        ytShorts.currentTime += 0.04;
      }
      break;
    
    case "Next Short":
      goToNextShort( ytShorts )
      break;

    case "Previous Short":
      goToPrevShort( ytShorts )
      break;
  }
  setSpeed = ytShorts.playbackRate;
});

const getCurrentId = () => {
  const videoEle = document.querySelector(
    "#shorts-player > div.html5-video-container > video"
  );
  if (videoEle && videoEle.closest("ytd-reel-video-renderer")) return +videoEle.closest("ytd-reel-video-renderer").id;
  return null;
};

const getLikeCount = (id) => {
  const likesElement = document.querySelector(
    `[id='${id}'] > div.overlay.style-scope.ytd-reel-video-renderer > ytd-reel-player-overlay-renderer #like-button`
  );

  // Use optional chaining and nullish coalescing to handle null values
  const numberOfLikes = likesElement?.firstElementChild?.innerText.split(/\r?\n/)[0]?.trim().replace(/\s/g, "").replace(/\.$/, "").toLowerCase() ?? "0";
  
  // Convert the number of likes to the appropriate format
  const likeCount = convertLocaleNumber(numberOfLikes);
  
  // If likeCount is anything other than a number, it'll return 0. Meaning it'll translate every language.
  return !isNaN(likeCount) ? likeCount : "0";
};

// Checking comment count aswell, as sometimes popular videos bug out and show 0 likes, but there's 1000+ comments.
const getCommentCount = (id) => {
  const commentsElement = document.querySelector(
    `[id='${id}'] > div.overlay.style-scope.ytd-reel-video-renderer > ytd-reel-player-overlay-renderer #comments-button`
  );

  // Use optional chaining and nullish coalescing to handle null values
  const numberOfComments = commentsElement?.firstElementChild?.innerText.split(/\r?\n/)[0]?.replace(/ /g, "") ?? "0";

  // Convert the number of comments to the appropriate format
  const commentCount = convertLocaleNumber(numberOfComments);

  // If commentCount is anything other than a number, it'll return 0. Meaning it'll handle every language.
  return !isNaN(commentCount) ? commentCount : 0;
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
  document.querySelector('#navigation-button-down > .style-scope.ytd-shorts > yt-button-shape > button.yt-spec-button-shape-next.yt-spec-button-shape-next--text.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-xl.yt-spec-button-shape-next--icon-button');

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
  if(localStorage.getItem("yt-player-volume") !== null && JSON.parse(localStorage.getItem("yt-player-volume"))["data"]["volume"]){
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

function getVideo() { return document.querySelector("#shorts-player>div>video"); }

//WheelProgram
function wheel(Element, codeA, codeB) {
    Element.addEventListener("wheel", (event) => {
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
  
  const ytShorts = getVideo();
  var currentId = getCurrentId();
  var likeCount = getLikeCount(currentId); 
  var actionList = getActionElement(currentId);
  var overlayList = getOverlayElement(currentId);
  var autoplayEnabled = localStorage.getItem("yt-autoplay") === "true" ? true : false;
  if (autoplayEnabled === null) autoplayEnabled = false;
  
  var progBarList = overlayList.children[2].children[0].children[0];
  progBarList.removeAttribute( "hidden" )

  if ( topId < currentId ) 
    topId = currentId

  // video has to have been playing to skip.
  // I'm undecided whether to use 0.5 or 1 for currentTime, as 1 isn't quite fast enough, but sometimes with 0.5, it skips a video above the minimum like count.
  if (ytShorts && ytShorts.currentTime > 0.5 && ytShorts.duration > 1) {
	  
	  if (shouldSkipShort(currentId, likeCount)) {
      console.log("[Better Youtube Shorts] :: Skipping short that had", likeCount, "likes");
      skippedId = currentId;
      skipShort(ytShorts);
    }
  
    if( shouldOpenComments() )
    {
      console.log("[Better Youtube Shorts] :: Opening comments");
      openComments()
    }
	}
  
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
        if (ytShorts.playbackRate < 16) getVideo().playbackRate += 0.25;
        setSpeed = getVideo().playbackRate;
      }
      function speeddown() {
        if (ytShorts.playbackRate > 0.25) getVideo().playbackRate -= 0.25;
        setSpeed = getVideo().playbackRate;
      }
      wheel(ytTimer, forward, backward);
      function forward() {
        getVideo().currentTime += 1;
      }
      function backward() {
        getVideo().currentTime -= 1;
      }

    }
    // Progress bar
    if (overlayList) {
      var progBarList = overlayList.children[2].children[0].children[0];
      var progBarBG = progBarList.children[0];
      var progBarPlayed = progBarList.children[1]; // The red part of the progress bar

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
        let x = event.clientX - ytShorts.getBoundingClientRect().left;
        // Deal with slight inaccuracies
        if (x < 0) x = 0;
        if (x > ytShorts.clientWidth) x = ytShorts.clientWidth;
        // Get timestamp and round to nearest 0.1
        let timestamp = ((x / ytShorts.clientWidth) * ytShorts.duration).toFixed(1);
        timestampTooltip.textContent = `${timestamp}s`;
        // Ensure tooltip stays visible at edges of client
        if ((x - (timestampTooltip.offsetWidth / 2)) > (ytShorts.clientWidth - timestampTooltip.offsetWidth)) {
          timestampTooltip.style.left = `${ytShorts.clientWidth - timestampTooltip.offsetWidth}px`;
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
        let x = event.clientX - ytShorts.getBoundingClientRect().left;
        if (x < 0) x = 0;
        if (x > ytShorts.clientWidth) x = ytShorts.clientWidth;
        ytShorts.currentTime = (x / ytShorts.clientWidth) * ytShorts.duration;
      });
    }
    if (currentId !== null) setVolumeSlider(ytShorts, currentId);
  }
  if (ytShorts) checkVolume(ytShorts);
}, 100);

/**
 * Converts a formatted number to its full integer value.
 * @param {string} string value to be converted (eg: 1.4M, 1,291 or 727) 
 * @returns converted number
 */
function convertLocaleNumber( string )
{
  if ( typeof string !== "string" ) return
  
  // todo  - add formats from other langs
  const multipliers = {
      // English
	  "b":   1_000_000_000,
	  "m":   1_000_000,
	  "k":   1_000,

	  // Italian
	  "mln": 1_000_000,

	  // Indian English
	  "lakh": 100_000,

	  // Portuguese
	  "mil": 1_000,

	  // Spanish
	  "mil": 1_000,

	  // French
	  "mio": 1_000_000,
	  "md":  1_000,

	  // German
	  "mio": 1_000_000,
	  "mrd": 1_000_000_000,
	  "tsd": 1_000,

	  // Japanese
	  "億":  1_000_000_000,
	  "万":  10_000,

	  // Chinese (Simplified)
	  "亿":  1_000_000_000,
	  "万":  10_000,

	  // Chinese (Traditional)
	  "億":  1_000_000_000,
	  "萬":  10_000,

	  // Russian
	  "млн": 1_000_000,
	  "тыс": 1_000,

	  // Hindi
	  "करोड़": 10_000_000,
	  "लाख":  100_000,

	  // Arabic
	  "مليون":   1_000_000,
	  "مليار":   1_000_000_000,
	  "ألف":     1_000,

	  // Korean
	  "억":  100_000_000,
	  "만":  10_000,

	  // Turkish
	  "milyon":    1_000_000,
	  "milyar":    1_000_000_000,
	  "bin":       1_000,

	  // Vietnamese
	  "triệu":    1_000_000,
	  "tỷ":       1_000_000_000,
	  "nghìn":    1_000,

	  // Thai
	  "ล้าน":    1_000_000,
	  "พันล้าน": 1_000_000_000,
	  "พัน":     1_000,

	  // Dutch
	  "mio":  1_000_000,
	  "mld":  1_000_000_000,
	  "k":    1_000,

	  // Greek
	  "εκ":   1_000_000,
	  "δισ":  1_000_000_000,
	  "χιλ":  1_000,

	  // Swedish
	  "mn":   1_000_000,
	  "md":   1_000_000_000,
	  "t":    1_000,
  }
	const regex = /^(\d{1,3}(?:(?:,\d{3})*(?:\.\d+)?)|(?:\d+))(?:([,.])(\d+))?([a-z]*)\.?$/i;
	const matches = string.match(regex);

	if (!matches) {
	  return 0;
	}

	let numericPart = matches[1].replace(/,/g, ""); // Remove commas
	if (matches[2] && matches[3]) {
	  // Decimal part exists, add it back
	  numericPart += `.${matches[3]}`;
	}

	const multiplier = matches[4].toLowerCase();
	const hasMultiplier = Object.keys(multipliers).includes(multiplier);

  if (hasMultiplier) {
    return numericPart * multipliers[multiplier];
  } else {
    // Remove decimals and commas from the numeric part
    const numericValue = parseInt(numericPart.replace(/[.,]/g, ""), 10);
    return numericValue;
  }
}

function goToNextShort( short )
{
  const scrollAmount = short.clientHeight
  document.getElementById( "shorts-container" ).scrollTop += scrollAmount
}

function goToPrevShort( short )
{
  const scrollAmount = short.clientHeight
  document.getElementById( "shorts-container" ).scrollTop -= scrollAmount

}