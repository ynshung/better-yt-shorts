import { saveSettingsToStorage } from "./SaveToStorage";
import { VOLUME_INCREMENT_AMOUNT } from "./declarations";
import { StateObject } from "./definitions";
import { getCurrentId, getVideo, getVolumeContainer, getVolumeSliderController } from "./getters";
import { render, wheel } from "./utils";

export function checkVolume( settings: any, sliderEnabled: boolean )
{
    const ytShorts = getVideo();

    if ( ytShorts === null ) return;
    if ( !sliderEnabled ) return;

    if ( settings?.volume !== null ) 
        ytShorts.volume = settings.volume;
    else
        settings.volume = ytShorts.volume;
}

// todo  - move this to its own lib script (probably call it volumeSlider.ts)
export function setVolume( settings: any, newVolume: number, enabled: boolean )
{
    settings.volume = newVolume;

    const volumeSliderController = getVolumeSliderController() as HTMLInputElement;
    if ( volumeSliderController === null ) return;
  
    const ytShorts = getVideo();
    volumeSliderController.value = "" + settings.volume;

    if ( ytShorts === null ) return;

    checkVolume( settings, enabled );

    saveSettingsToStorage( settings );
   
}

export function setVolumeSlider( state: StateObject, settings: any, enabled: boolean )
{
    if ( !enabled ) return;

    const id = getCurrentId();

    const volumeContainer = getVolumeContainer();
    // const slider = document.createElement("input")
    const slider = render(`
    <input
      id="volumeSliderController${id}"
      type="range"
      class="volume-slider betterYT-volume-slider"
      min="0"
      max="1"
      step="0.01"
      orient="vertical"
      value="${settings.volume}"
    />
  `);

    if( settings.volume === null ) settings.volume = 0.5;

    volumeContainer.appendChild( slider );
  
    // Prevent video from pausing/playing on click
    slider.addEventListener( "input", (e: any) => setVolume( settings, e.target.valueAsNumber, enabled ) );
    slider.addEventListener( "click", e => e.stopPropagation() );

    wheel(
    slider as HTMLElement,
    () => {
        const video = getVideo();
        if (video !== null) setVolume(settings, video.volume + VOLUME_INCREMENT_AMOUNT, enabled);
    },
    () => {
        const video = getVideo();
        if (video !== null) setVolume(settings, video.volume - VOLUME_INCREMENT_AMOUNT, enabled);
    }
    );
}

