import local from "../background/i18n"
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
  if ( !enabled )          return false

  // ? - for issue 131 - may want to enable this later
  // if ( settings.autoplay ) ytShorts.loop = !settings.autoplay
  // else ytShorts.loop = true
}

export function createAutoplaySwitch( settings: any, enabled: boolean )
{
  if ( !enabled ) return

  const actionElement = getActionElement()
  const ytShorts = getVideo()

  // Autoplay Switch
  const autoplaySwitch = render(`
    <div>
      <label class="autoplay-switch">
        <input type="checkbox" id="autoplay-checkbox${ getCurrentId() }" ${ settings.autoplay ? "checked" : "" }/>
        <span class="autoplay-slider"></span>
      </label>
      <div class="yt-spec-button-shape-with-label__label">
        <span 
          role="text"
          class="betterYT-auto yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--text-alignment-center"
        > ${local("autoplay")} </span>
      </div>
    </div>
  `)

  actionElement.insertBefore( autoplaySwitch, actionElement.children[1] )

  // ? - for issue 131 - may want to delete this later
  if ( ytShorts !== null )
    ytShorts.loop = !settings.autoplay

  document.getElementById( `autoplay-checkbox${ getCurrentId() }` )
    ?.addEventListener( "change", ( e: any ) => {
      settings.autoplay = e.target.checked

      // ? - for issue 131 - may want to delete this later
      const ytShorts = getVideo()
      if ( ytShorts !== null )
        ytShorts.loop = !settings.autoplay

      saveSettingsToStorage( settings )
    })
}