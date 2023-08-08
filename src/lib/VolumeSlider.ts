import { saveSettingsToStorage } from "./SaveToStorage"
import { storage } from "./declarations"
import { StateObject } from "./definitions"
import { getCurrentId, getVideo, getVolumeContainer, getVolumeSliderController } from "./getters"

export function checkVolume( settings: any )
{
  const ytShorts = getVideo()

  if ( ytShorts === null ) return

  if ( settings?.volume !== null ) 
    ytShorts.volume = settings.volume
  else
    settings[ "volume" ] = ytShorts.volume
}

// todo  - move this to its own lib script (probably call it volumeSlider.ts)
export function setVolume( settings: any, newVolume: number )
{
  settings[ "volume" ] = newVolume

  const volumeSliderController = getVolumeSliderController() as HTMLInputElement
  if ( volumeSliderController === null ) return
  
  const ytShorts = getVideo()
  volumeSliderController.value = "" + settings.volume

  if ( ytShorts === null ) return

  checkVolume( settings )

  saveSettingsToStorage( settings )
   
}

// todo  - add proper type
export function setVolumeSlider( state: StateObject, settings: any  )
{
  const ytShorts = getVideo()
  const id = state.id

  const volumeContainer = getVolumeContainer()
  const slider = document.createElement("input")

  if( state.userVolume === null ) state.userVolume = 0.5

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
  slider.value = state.userVolume

  slider.addEventListener( "input", (e: any) => setVolume( settings, e.target.valueAsNumber ) )

  // Prevent video from pausing/playing on click
  slider.addEventListener("click", data => data.stopPropagation() )
}