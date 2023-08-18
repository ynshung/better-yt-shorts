import { saveSettingsToStorage } from "./SaveToStorage"
import { skipShort } from "./VideoState"
import { getActionElement, getCurrentId, getVideo } from "./getters"
import { render } from "./utils"

export function handleAutoplay( settings: any, enabled: boolean )
{ 
  if ( !enabled ) return
  if ( !settings.autoplay ) return
  skipShort()
}

export function handleEnableAutoplay( settings: any, enabled: boolean )
{
  const ytShorts = getVideo()
  if ( ytShorts === null ) return false

  if ( settings.autoplay ) ytShorts.loop = !enabled
  else ytShorts.loop = true;
}

export function createAutoplaySwitch( settings: any, enabled: boolean )
{
  if ( !enabled ) return

  const actionElement = getActionElement()
  
  // Autoplay Switch
  const autoplaySwitch = render(`
    <div class="yt-spec-button-shape-with-label__label">
      <label class="autoplay-switch">
        <input type="checkbox" id="autoplay-checkbox${ getCurrentId() }" ${ settings.autoplay ? "checked" : "" }/>
        <span class="autoplay-slider"></span>
      </label>

      <span 
        role="text"
        class=" yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--text-alignment-center"
      > Autoplay </span>
    </div>
  `)

  actionElement.insertBefore( autoplaySwitch, actionElement.children[1] )

  document.getElementById( `autoplay-checkbox${ getCurrentId() }` )
    ?.addEventListener( "change", ( e: any ) => {
      settings.autoplay = e.target.checked

      saveSettingsToStorage( settings )
    })
}