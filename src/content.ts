import BROWSER from "./background/browser"
import { goToNextShort, goToPrevShort } from "./lib/changeShort"
import { DEFAULT_KEYBINDS, DEFAULT_OPTIONS, state, storage } from "./lib/declarations"
import { ChangedObjectStateEnum } from "./lib/definitions"
import { getActionElement, getCurrentId, getLikeCount, getNextButton, getOverlayElement, getVideo, getVolumeContainer } from "./lib/getters"
import { retrieveKeybindsFromStorage, retrieveOptionsFromStorage } from "./lib/retrieveFromStorage"
import { shouldSkipShort, skipShort } from "./lib/skipShort"
import { getKeyFromEnum, wheel } from "./lib/utils"



/**
 * content.ts
 * 
 * Code in this file will be injected into the page itself.
 * For popup code, see  ./main.tsx
 */

var keybinds = null as any
var options  = null as any

retrieveKeybindsFromStorage( newBinds => { keybinds = newBinds } )
retrieveOptionsFromStorage(  newOpts  => { options = newOpts   } )

// todo  - test this on firefox
BROWSER.runtime.onMessage.addListener( ( req, sender, sendResponse ) => {
  if ( req?.keybinds )
    keybinds = req.keybinds 
  if ( req?.options )
    options = req.options

  resetMainInterval()
} )

// watch for color scheme changes
// window.matchMedia( "(prefers-color-scheme: dark)" ).addEventListener( "change", ({matches}) => handleColorScheme( matches ) )

document.addEventListener("keydown", (data) => {
  if (
    document.activeElement === document.querySelector(`input`) ||
    document.activeElement === document.querySelector("#contenteditable-root")
    ) return // Avoids using keys while the user interacts with any input, like search and comment.
  const ytShorts = getVideo()
  if (!ytShorts) return

  const key    = data.code
  const keyAlt = data.key.toLowerCase() // for legacy keybinds

  let command
  for ( const [cmd, keybind] of Object.entries( keybinds as Object ) ) 
    if ( key === keybind || keyAlt === keybind ) 
      command = cmd

  if (!command) return
  
  switch (command) {
    case "Seek Backward":
      ytShorts.currentTime -= 5
      break

    case "Seek Forward":
      ytShorts.currentTime += 5
      break

    case "Decrease Speed":
      if (ytShorts.playbackRate > 0.25) ytShorts.playbackRate -= 0.25
      break

    case "Reset Speed":
      ytShorts.playbackRate = 1
      break

    case "Increase Speed":
      if (ytShorts.playbackRate < 16) ytShorts.playbackRate += 0.25
      break

    case "Increase Volume":
      if (ytShorts.volume <= 0.975) {
        setVolume(ytShorts.volume + 0.025)
      }
      break

    case "Decrease Volume":
      if (ytShorts.volume >= 0.025) {
        setVolume(ytShorts.volume - 0.025)
      }
      break

    case "Toggle Mute":
      if ( !state.muted ) {
        state.muted = true
        state.volumeState = ytShorts.volume
        ytShorts.volume = 0
      } else {
        state.muted = false
        ytShorts.volume = state.volumeState
      }
      break
      
    case "Next Frame":
      if (ytShorts.paused) {
        ytShorts.currentTime -= 0.04
      }
      break

    case "Previous Frame":
      if (ytShorts.paused) {
        ytShorts.currentTime += 0.04
      }
      break
    
    case "Next Short":
      goToNextShort( ytShorts )
      break

    case "Previous Short":
      goToPrevShort( ytShorts )
      break
  }
  setSpeed = ytShorts.playbackRate
})

// todo  - fix this, move this
const setTimer = ( currTime: number, duration: number ) => {
  const id = getCurrentId()
  if ( document.getElementById(`ytTimer${id}`) === null ) return false

  const timerElement = document.getElementById( `ytTimer${id}` ) as HTMLElement
  
  timerElement.innerText = `${currTime}/${duration}s`

  return true
}

// todo  - generate this using my render() util method
const setVolumeSlider = ( ytShorts: HTMLVideoElement ) => {
  const id = state.id

  const volumeContainer = getVolumeContainer(id)
  const slider = document.createElement("input")

  if( state.actualVolume === null ) state.actualVolume = 0.5

  // checkVolume(ytShorts) // todo - uncomment this when added
  slider.id = `volumeSliderController${id}`
  slider.classList.add("volume-slider")
  slider.classList.add("betterYT-volume-slider")
  slider.type = "range"
  slider.min  = "0"
  slider.max  = "1"
  slider.step = "0.01"
  slider.setAttribute("orient", "vertical")
  volumeContainer.appendChild(slider)
  slider.value = state.actualVolume

  slider.addEventListener( "input", e => setVolume( (<HTMLInputElement>e.target).valueAsNumber ) )

  // Prevent video from pausing/playing on click
  slider.addEventListener("click", (data) => {
    data.stopPropagation()
  })
}

// todo  - move this to its own lib script (probably call it volumeSlider.ts)
const setVolume = ( volume: number ) => {
  const id = getCurrentId()
  const volumeSliderController = document.getElementById(`volumeSliderController${id}`) as HTMLInputElement
  
  if ( volumeSliderController === null ) return

  volumeSliderController.value = "" + volume

  // const ytShorts = document.querySelector(
  //   "#shorts-player > div.html5-video-container > video"
  // ) as HTMLVideo
  const ytShorts = getVideo()

  if ( ytShorts === null ) return

  const volumeData = {
    data: {
      volume: state.volume, 
      muted:  state.muted, 
    }
  }

  ytShorts.volume = volume
  localStorage.setItem( "yt-player-volume", JSON.stringify( volumeData ) )
}

// todo  - do this
// const checkVolume = ( ytShorts: HTMLVideoElement ) => {
//   if(localStorage.getItem("yt-player-volume") !== null && JSON.parse(localStorage.getItem("yt-player-volume"))["data"]["volume"]){
//     actualVolume = JSON.parse(localStorage.getItem("yt-player-volume"))["data"]["volume"]
//     ytShorts.volume = actualVolume
//   }else{
//     actualVolume = ytShorts.volume
//   }
// }

const setPlaybackRate = ( currSpeed: number ) => {
  const id = getCurrentId()
  const playBackElement = document.getElementById( `ytPlayback${id}` ) as HTMLElement

  if ( playBackElement === null ) return false

  playBackElement.innerText = `${currSpeed}x`

  return true
}

var injectedItem = new Set()
var lastTime = -1
var lastSpeed = 0
var setSpeed = 1

var timer = setInterval( main, 100 )

function main() {
  if (window.location.toString().indexOf("youtube.com/shorts/") < 0) return
  
  const ytShorts      = getVideo()
  var currentId       = getCurrentId()
  var likeCount       = getLikeCount( currentId ) 
  var actionList      = getActionElement( currentId )
  var overlayList     = getOverlayElement( currentId )
  var autoplayEnabled = localStorage.getItem("yt-autoplay") === "true" ? true : false

  if (autoplayEnabled === null) autoplayEnabled = false
  
  var progBarList = overlayList.children[3].children[0].children[0]
  progBarList.removeAttribute( "hidden" )

  if ( state.topId < state.currentId ) 
    state.topId = currentId

  // video has to have been playing to skip.
  // I'm undecided whether to use 0.5 or 1 for currentTime, as 1 isn't quite fast enough, but sometimes with 0.5, it skips a video above the minimum like count.
  if (ytShorts && ytShorts.currentTime > 0.5 && ytShorts.duration > 1) {
	  
	  if ( shouldSkipShort( options, state.currentId, likeCount ) ) {
      console.log("[Better Youtube Shorts] :: Skipping short that had", likeCount, "likes")
      state.skippedId = currentId
      skipShort(ytShorts)
	  }
	}
  
  if ( ytShorts === null ) return

  var currTime = -1
  if ( injectedItem.has( currentId ) ) {

    currTime = Math.round( ytShorts.currentTime )
    var currSpeed = ytShorts.playbackRate

    if (autoplayEnabled && ytShorts && ytShorts.currentTime >= ytShorts.duration - 0.11) {
      var nextButton = getNextButton()
      nextButton.click()
    }

    if (currTime !== lastTime) {
      // Using this as a check whether the elements actually were injected on the page
      var injectedSuccess = setTimer(currTime, Math.round(ytShorts.duration || 0))
      // If failed, retry injection during next interval
      if (!injectedSuccess) injectedItem.delete(currentId)
      lastTime = currTime
    }
    if (currSpeed != lastSpeed) {
      const setRateSuccess = setPlaybackRate(currSpeed)
      if (setRateSuccess) lastSpeed = currSpeed
    }

  } else {
    lastTime = -1
    lastSpeed = 0
    if (autoplayEnabled && ytShorts) ytShorts.loop = false

    if (actionList) {

      const betterYTContainer = document.createElement("div")
      betterYTContainer.id = "betterYT-container"
      betterYTContainer.setAttribute("class", "button-container style-scope ytd-reel-player-overlay-renderer")

      const ytdButtonRenderer = document.createElement("div")
      ytdButtonRenderer.setAttribute("class", "betterYT-renderer style-scope ytd-reel-player-overlay-renderer")

      const ytButtonShape = document.createElement("div")
      ytButtonShape.setAttribute("class", "betterYT-button-shape")

      const ytLabel = document.createElement("label")
      ytLabel.setAttribute("class", "yt-spec-button-shape-with-label")

      const ytButton = document.createElement("button")      
      ytButton.setAttribute("class", "yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-l yt-spec-button-shape-next--icon-button ")
      // Playback Rate
      var para0 = document.createElement("p")
      para0.classList.add("betterYT")
      para0.id = `ytPlayback${currentId}`

      // Timer
      const ytTimer = document.createElement("div")
      ytTimer.classList.add("yt-spec-button-shape-with-label__label")
      var span1 = document.createElement("span")
      span1.setAttribute("class", "yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--text-alignment-center yt-core-attributed-string--word-wrapping")
      span1.id = `ytTimer${currentId}`
      span1.setAttribute("role", "text")
      ytTimer.appendChild(span1)

      // Match YT's HTML structure
      ytButton.appendChild(para0)
      ytLabel.appendChild(ytButton)
      ytLabel.appendChild(ytTimer)
      ytButtonShape.appendChild(ytLabel)
      ytdButtonRenderer.appendChild(ytButtonShape)
      betterYTContainer.appendChild(ytdButtonRenderer)

      actionList.insertBefore(betterYTContainer, actionList.children[1])

      // Autoplay Switch
      const switchContainer = document.createElement("div")
      const autoplaySwitch = document.createElement("label")
      autoplaySwitch.classList.add("autoplay-switch")
      var checkBox = document.createElement("input")
      checkBox.type = "checkbox"
      checkBox.id = `autoplay-checkbox${currentId}`
      checkBox.checked = autoplayEnabled
      var autoplaySpan = document.createElement("span")
      autoplaySpan.classList.add("autoplay-slider")
      autoplaySwitch.append(checkBox, autoplaySpan)
      switchContainer.appendChild(autoplaySwitch)

      actionList.insertBefore(switchContainer, actionList.children[1])
      
      const autoplayTitle = document.createElement("div")
      autoplayTitle.classList.add("yt-spec-button-shape-with-label__label")
      var span2 = document.createElement("span")
      span2.setAttribute("class", "betterYT-auto yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--text-alignment-center")
      span2.setAttribute("role", "text")
      span2.textContent = "Autoplay"
      autoplayTitle.appendChild(span2)
    
      actionList.insertBefore(autoplayTitle, actionList.children[2])
      injectedItem.add(currentId)
      

      ytShorts.playbackRate = setSpeed
      setPlaybackRate(setSpeed)
      injectedSuccess = setTimer( currTime || 0, Math.round(ytShorts.duration || 0))

      betterYTContainer.addEventListener("click",() => {
        ytShorts.playbackRate = 1
        setSpeed = ytShorts.playbackRate
      })

      checkBox.addEventListener('change', () => {
        if (checkBox.checked) {
          localStorage.setItem("yt-autoplay", "true")
          ytShorts.loop = false
        } else {
          localStorage.setItem("yt-autoplay", "false")
          ytShorts.loop = true
        }
      })

      // todo  - clean all of this up
      wheel( 
        ytButton, 
        speedup, 
        speeddown
      )
      
      function speedup() 
      {
        const video = getVideo()
        if ( video === null ) return

        if (video.playbackRate < 16) video.playbackRate += 0.25
        setSpeed = video.playbackRate
      }
      function speeddown() 
      {
        const video = getVideo()
        if ( video === null ) return

        if (video.playbackRate > 0.25) video.playbackRate -= 0.25
        setSpeed = video.playbackRate
      }

      wheel( ytTimer, forward, backward )
      function forward()
      {
        const video = getVideo()
        if ( video !== null ) video.currentTime += 1
      }

      function backward()
      {
        const video = getVideo()
        if ( video !== null ) video.currentTime -= 1
      }

    }
    // Progress bar
    // todo  - move this to its own file
    if ( overlayList ) 
    {
      var progBarList = overlayList.children[2].children[0].children[0]
      var progBarBG = progBarList.children[0]
      var progBarPlayed = progBarList.children[1] // The red part of the progress bar

      const timestampTooltip = document.createElement("div")
      timestampTooltip.classList.add("betterYT-timestamp-tooltip")

      progBarList.appendChild(timestampTooltip);

      // Styling to ensure rest of bottom overlay (shorts title/sub button) stay in place
      (<HTMLElement>overlayList.children[0]).style.marginBottom = "-7px";
      (<HTMLElement>progBarList).style.height                   = "10px";
      (<HTMLElement>progBarList).style.paddingTop               = "2px" ;// Slight padding to increase hover box

      progBarList.classList.add('betterYT-progress-bar')
      progBarBG.classList.add('betterYT-progress-bar')
      progBarPlayed.classList.add('betterYT-progress-bar')

      progBarList.addEventListener("mouseover", () => {
        progBarBG.classList.add('betterYT-progress-bar-hover')
        progBarPlayed.classList.add('betterYT-progress-bar-hover')
      })
      progBarList.addEventListener("mousemove", (event) => {
        let x = (<MouseEvent>event).clientX - ytShorts.getBoundingClientRect().left
        // Deal with slight inaccuracies
        if (x < 0) x = 0
        if (x > ytShorts.clientWidth) x = ytShorts.clientWidth
        // Get timestamp and round to nearest 0.1
        let timestamp = ((x / ytShorts.clientWidth) * ytShorts.duration).toFixed(1)
        timestampTooltip.textContent = `${timestamp}s`
        // Ensure tooltip stays visible at edges of client
        if ((x - (timestampTooltip.offsetWidth / 2)) > (ytShorts.clientWidth - timestampTooltip.offsetWidth)) {
          timestampTooltip.style.left = `${ytShorts.clientWidth - timestampTooltip.offsetWidth}px`
        } else if ((x - (timestampTooltip.offsetWidth / 2)) <= 0) {
          timestampTooltip.style.left = "0px"
        } else {
          timestampTooltip.style.left = `${x - (timestampTooltip.offsetWidth / 2)}px`
        }
        timestampTooltip.style.top = "-20px"
        timestampTooltip.style.display = 'block'
      })
      progBarList.addEventListener("mouseout", () => {
        progBarBG.classList.remove('betterYT-progress-bar-hover')
        progBarPlayed.classList.remove('betterYT-progress-bar-hover')
        timestampTooltip.style.display = 'none'
      })
      progBarList.addEventListener("click", (event) => {
        let x = (<MouseEvent>event).clientX - ytShorts.getBoundingClientRect().left
        if (x < 0) x = 0
        if (x > ytShorts.clientWidth) x = ytShorts.clientWidth
        ytShorts.currentTime = (x / ytShorts.clientWidth) * ytShorts.duration
      })
    }
    if (currentId !== null) setVolumeSlider( ytShorts )
  }
  // if (ytShorts) checkVolume(ytShorts) // todo  - uncomment this when added
}

function resetMainInterval()
{
  clearInterval( timer )
  timer = setInterval( main, 100 )
}