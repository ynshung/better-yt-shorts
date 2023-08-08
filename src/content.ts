import BROWSER from "./background/browser"
import { setPlaybackRate, setTimer } from "./lib/PlaybackRate"
import { saveSettingsToStorage } from "./lib/SaveToStorage"
import { checkVolume, setVolumeSlider } from "./lib/VolumeSlider"
import { DEFAULT_STATE } from "./lib/declarations"
import { StateObject } from "./lib/definitions"
import { getActionElement, getCurrentId, getLikeCount, getNextButton, getOverlayElement, getVideo } from "./lib/getters"
import { handleKeyEvent } from "./lib/handleKeyEvent"
import { retrieveKeybindsFromStorage, retrieveOptionsFromStorage, retrieveSettingsFromStorage } from "./lib/retrieveFromStorage"
import { shouldSkipShort, skipShort } from "./lib/skipShort"
import { render, wheel } from "./lib/utils"

/**
 * content.ts
 * 
 * Code in this file will be injected into the page itself.
 * For popup code, see  ./main.tsx
 */

const state = new Proxy( DEFAULT_STATE, {
  set: ( o: StateObject, prop: string, val: any ) => {
    o[ prop ] = val
    return true
  }
}  )

var keybinds = null as any
var options  = null as any
var settings = null as any

// todo  - add "settings" to localstorage (merge autoplay + player volume into one) 
// localStorage.getItem("yt-player-volume") !== null && JSON.parse(localStorage.getItem("yt-player-volume"))["data"]["volume"]

retrieveKeybindsFromStorage(  newBinds    => { keybinds = newBinds    } )

retrieveOptionsFromStorage(   newOpts     => { options  = newOpts     } )

retrieveSettingsFromStorage(  newSettings => { settings = newSettings } )

// todo  - test this on firefox
BROWSER.runtime.onMessage.addListener( ( req, sender, sendResponse ) => {
  if ( req?.keybinds )
    keybinds = req.keybinds 
  if ( req?.options )
    options = req.options

  resetIntervals()
} )

// watch for color scheme changes
// window.matchMedia( "(prefers-color-scheme: dark)" ).addEventListener( "change", ({matches}) => handleColorScheme( matches ) )

document.addEventListener( "keydown", e => handleKeyEvent( e, settings, keybinds, options, state ) )

var injectedItem = new Set()
var lastTime     = -1
var lastSpeed    = 0

var main_interval    = setInterval( main, 100 )
var volume_interval  = setInterval( volumeIntervalCallback, 10 )

function main() {
  if ( window.location.toString().indexOf("youtube.com/shorts/") < 0 ) return
  
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
	  
	  if ( shouldSkipShort( state, options, state.currentId, likeCount ) ) {
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

    setPlaybackRate( state )

  } 
  else 
  {
    lastTime = -1
    lastSpeed = 0

    if (autoplayEnabled && ytShorts) ytShorts.loop = false

    if (actionList) 
    {

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
      const autoplaySwitch = `
        <div>
          <label class="autoplay-switch">
            <input type="checkbox" id="autoplay-checkbox${ getCurrentId() }" ${ settings.autoplay ? "checked" : "" }/>
            <span class="autoplay-slider"></span>
          </label>
        </div>
      `

      actionList.insertBefore( render( autoplaySwitch ), actionList.children[1] )

      const autoplayTitle = `
        <div class="yt-spec-button-shape-with-label__label">
          <span 
            role="text"
            class="betterYT-auto yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--text-alignment-center"
          > Autoplay </span>
        </div>
      `

      actionList.insertBefore( render( autoplayTitle ), actionList.children[2] )

      injectedItem.add( getCurrentId() )

      ytShorts.playbackRate = state.playbackRate
      setPlaybackRate( state )
      injectedSuccess = setTimer( currTime || 0, Math.round(ytShorts.duration || 0))

      betterYTContainer.addEventListener("click", () => {
        ytShorts.playbackRate = 1
        state.playbackRate = ytShorts.playbackRate
      })

      document.getElementById( `autoplay-checkbox${getCurrentId()}` )?.addEventListener('change', ( e: any ) => {
        if ( e.target.checked )
        {
          localStorage.setItem("yt-autoplay", "true")
          ytShorts.loop = false
        } 
        else 
        {
          localStorage.setItem("yt-autoplay", "false")
          ytShorts.loop = true
        }
      })

      
      wheel( 
        ytButton, 
        () => {
          // speedup
          const video = getVideo()
          if ( video === null ) return

          if (video.playbackRate < 16) video.playbackRate += 0.25
          state.playbackRate = video.playbackRate

        }, 
        () => {
          // speeddown
          const video = getVideo()
          if ( video === null ) return

          if (video.playbackRate > 0.25) video.playbackRate -= 0.25
          state.playbackRate = video.playbackRate
        }
      )
      
      wheel( 
        ytTimer, 
        () =>  { 
          // forward
          const video = getVideo()
          if ( video !== null ) video.currentTime += 1 
        },
        () => { 
          // backward
          const video = getVideo()
          if ( video !== null ) video.currentTime -= 1 
        }
      )

    }





    // Progress bar
    // todo  - move this to its own file
    if ( overlayList ) 
    {
      var progBarList = overlayList.children[3].children[0].children[0]
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
   
    if (currentId !== null) setVolumeSlider( state, settings )
  
  }

  

}

function volumeIntervalCallback()
{
  if ( window.location.toString().indexOf("youtube.com/shorts/") < 0 ) return

  if ( getVideo() ) checkVolume( settings )
}


function resetIntervals()
{
  clearInterval( volume_interval )
  volume_interval = setInterval( volumeIntervalCallback, 10 )
  
  clearInterval( main_interval )
  main_interval = setInterval( main, 100 )
}