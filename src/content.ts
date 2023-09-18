import BROWSER from "./background/browser"
import { checkVolume } from "./lib/VolumeSlider"
import { DEFAULT_STATE } from "./lib/declarations"
import { StateObject } from "./lib/definitions"
import { getCurrentId, getLikeCount, getVideo, isCommentsPanelOpen } from "./lib/getters"
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
import { handleReturnLinksToComments } from "./lib/ReturnLinksToComments"

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

var high_priority_interval = setInterval( highPriorityInterval,  10 )
var mid_priority_interval  = setInterval( midPriorityInterval,  100 )
var low_priority_interval  = setInterval( lowPriorityInterval, 1000 )

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

/**
 * Reserve this specifically for things that require instantaneous response
 */
function highPriorityInterval()
{
  if ( window.location.toString().indexOf("youtube.com/shorts/") < 0 ) return
  if ( getVideo() ) checkVolume( settings, features[ "Volume Slider" ] )
}

/**
 * Most actions should go here
 */
function midPriorityInterval()
{
  main()
}

/**
 * Put expensive, unimportant actions in here.
 */
function lowPriorityInterval()
{
  if ( window.location.toString().indexOf("youtube.com/shorts/") < 0 ) return

  if ( isCommentsPanelOpen() )
    handleReturnLinksToComments( options[ "show_links_in_comments" ] )
}

function resetIntervals()
{
  clearInterval( high_priority_interval )
  high_priority_interval = setInterval( highPriorityInterval, 10 )
  
  clearInterval( mid_priority_interval )
  mid_priority_interval = setInterval( midPriorityInterval, 100 )

  clearInterval( low_priority_interval )
  low_priority_interval = setInterval( lowPriorityInterval, 1000 )
}
