import BROWSER from "./background/browser"
import { checkVolume } from "./lib/VolumeSlider"
import { DEFAULT_STATE } from "./lib/declarations"
import { StateObject } from "./lib/definitions"
import { getCurrentId, getLikeCount, getVideo } from "./lib/getters"
import { handleKeyEvent } from "./lib/handleKeyEvent"
import { retrieveFeaturesFromStorage, retrieveKeybindsFromStorage, retrieveOptionsFromStorage, retrieveSettingsFromStorage } from "./lib/retrieveFromStorage"
import { handleSkipShortsWithLowLikes, shouldSkipShort } from "./lib/SkipShortsWithLowLikes"

// need this to ensure css is loaded in the dist
import "./css/content.css"
import { handleInjectionChecks } from "./lib/InjectionSuccess"
import { hasVideoEnded, isVideoPlaying } from "./lib/VideoState"
import { handleAutoplay, handleEnableAutoplay } from "./lib/Autoplay"
import { handleAutomaticallyOpenComments } from "./lib/AutomaticallyOpenComments"
import { handleProgressBarNotAppearing } from "./lib/ProgressBar"

/**
 * content.ts
 * 
 * Code in this file will be injected into the page itself.
 * For popup code, see  ./main.tsx
 */

const state = new Proxy( DEFAULT_STATE, {
  set( o: StateObject, prop: string, val: any )
  {
    o[ prop ] = val

    const ytShorts = getVideo()

    // handle additional changes
    if ( ytShorts !== null )
    {
      switch ( prop )
      {
        case "playbackRate":
          ytShorts .playbackRate = val
          break;
      }
    }

    return true
  }
}  )

var keybinds = null as any
var options  = null as any
var settings = null as any
var features = null as any

// todo  - add "settings" to localstorage (merge autoplay + player volume into one) 
// localStorage.getItem("yt-player-volume") !== null && JSON.parse(localStorage.getItem("yt-player-volume"))["data"]["volume"]

retrieveKeybindsFromStorage(  newBinds    => { keybinds = newBinds    } )
retrieveOptionsFromStorage(   newOpts     => { options  = newOpts     } )
retrieveSettingsFromStorage(  newSettings => { settings = newSettings } )
retrieveFeaturesFromStorage(  newFeatures => { features = newFeatures } )

// todo  - test this on firefox
BROWSER.runtime.onMessage.addListener( ( req, sender, sendResponse ) => {
  if ( req?.keybinds )
    keybinds = req.keybinds 
  if ( req?.options )
    options = req.options
  if ( req?.features )
    features = req.features

  resetIntervals()
} )

document.addEventListener( "keydown", e => handleKeyEvent( e, features, keybinds, settings, options, state ) )

var main_interval    = setInterval( main, 100 )
var volume_interval  = setInterval( volumeIntervalCallback, 10 )

function main() {
  if ( window.location.toString().indexOf("youtube.com/shorts/") < 0 ) return
  
  const ytShorts      = getVideo()
  var currentId       = getCurrentId() 

  if ( ytShorts === null )  return
  if ( currentId === null ) return

  if ( state.topId < currentId ) 
    state.topId = currentId

  // video has to have been playing to skip.
  // I'm undecided whether to use 0.5 or 1 for currentTime, as 1 isn't quite fast enough, but sometimes with 0.5, it skips a video above the minimum like count.
  if ( isVideoPlaying() ) 
  {
	  handleSkipShortsWithLowLikes( state, options )
    handleAutomaticallyOpenComments( state, options ) // dev note: the implementation of this feature is a good starting point to figure out how to format your own
	}
  if ( hasVideoEnded() )
  {
    handleAutoplay( settings, features[ "Autoplay" ] )
  }

  handleProgressBarNotAppearing()
  handleEnableAutoplay( settings, features[ "Autoplay" ] )
  handleInjectionChecks( state, settings, features )
}

function volumeIntervalCallback()
{
  if ( window.location.toString().indexOf("youtube.com/shorts/") < 0 ) return
  if ( getVideo() ) checkVolume( settings, features[ "Volume Slider" ] )
}

function resetIntervals()
{
  clearInterval( volume_interval )
  volume_interval = setInterval( volumeIntervalCallback, 10 )
  
  clearInterval( main_interval )
  main_interval = setInterval( main, 100 )
}