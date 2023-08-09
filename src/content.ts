import BROWSER from "./background/browser"
import { populateActionElement } from "./lib/ActionElement"
import { setPlaybackRate, setTimer } from "./lib/PlaybackRate"
import { modifyProgressBar } from "./lib/ProgressBar"
import { checkVolume, setVolumeSlider } from "./lib/VolumeSlider"
import { DEFAULT_STATE } from "./lib/declarations"
import { StateObject } from "./lib/definitions"
import { getCurrentId, getLikeCount, getVideo } from "./lib/getters"
import { handleKeyEvent } from "./lib/handleKeyEvent"
import { retrieveKeybindsFromStorage, retrieveOptionsFromStorage, retrieveSettingsFromStorage } from "./lib/retrieveFromStorage"
import { shouldSkipShort, skipShort } from "./lib/skipShort"

// need this to ensure css is loaded in the dist
import "./css/content.css"

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

// var injectedItem = new Set()
var lastTime     = -1
var lastSpeed    = 0

var main_interval    = setInterval( main, 100 )
var volume_interval  = setInterval( volumeIntervalCallback, 10 )

function main() {
  if ( window.location.toString().indexOf("youtube.com/shorts/") < 0 ) return
  
  const ytShorts      = getVideo()
  var currentId       = getCurrentId()
  var likeCount       = getLikeCount( currentId ) 
  // var actionList      = getActionElement( currentId )
  // var overlayList     = getOverlayElement()
  // var autoplayEnabled = localStorage.getItem("yt-autoplay") === "true" ? true : false

  // if (autoplayEnabled === null) autoplayEnabled = false // unneeded
  
  // var progBarList = getProgressBarList()
  // progBarList.removeAttribute( "hidden" )

  if ( currentId !== null && state.topId < currentId ) 
    state.topId = currentId

  // video has to have been playing to skip.
  // I'm undecided whether to use 0.5 or 1 for currentTime, as 1 isn't quite fast enough, but sometimes with 0.5, it skips a video above the minimum like count.
  if ( ytShorts && ytShorts.currentTime > 0.5 && ytShorts.duration > 1 ) {
	  
	  if ( shouldSkipShort( state, options, state.currentId, likeCount ) ) {
      console.log("[BYS] :: Skipping short that had", likeCount, "likes")
      state.skippedId = currentId
      skipShort()
	  }

	}
  
  if ( ytShorts === null ) return

  var currTime = Math.round( ytShorts.currentTime )

  // ? have items been added to the page?
  if ( state.injectedItems.has( currentId ) )
  {
    // let currSpeed = ytShorts.playbackRate

    if ( settings.autoplay && ytShorts.currentTime >= ytShorts.duration - 0.11 ) 
    {
      skipShort()
    }

    if ( currTime !== state.lastTime ) {
      // Using this as a check whether the elements actually were injected on the page
      let injectedSuccess = setTimer( currTime, Math.round(ytShorts.duration || 0) )
      
      // If failed, retry injection during next interval
      if (!injectedSuccess) state.injectedItems.delete( currentId )
      
      state.lastTime = currTime
    }

    setPlaybackRate( state )

  } 
  // ? if not, then add them
  else 
  {
    state.lastTime = -1 // reset
    
    if ( settings.autoplay ) ytShorts.loop = false
    
    populateActionElement( state, settings )
    
    // Progress bar
    modifyProgressBar()
    
    if (currentId !== null) setVolumeSlider( state, settings )
    
    state.injectedItems.add( getCurrentId() )
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

