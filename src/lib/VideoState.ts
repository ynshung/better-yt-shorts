import { getBackButton, getMuteButton, getNextButton, getVideo } from "./getters";

export function isVideoPlaying()
{
    const ytShorts = getVideo();
    if ( ytShorts === null ) return false;

    return ytShorts.currentTime > 0.5 && ytShorts.duration > 1;
}

export function hasVideoEnded()
{
    const ytShorts = getVideo();
    if ( ytShorts === null ) return false;

    return ytShorts.currentTime >= ytShorts.duration - 0.25;
}

export function skipShort()
{
    getNextButton()?.click();
}
export function goToNextShort()
{
    getNextButton()?.click();
}

export function goToPreviousShort()
{
    getBackButton()?.click();
}

export function restartShort()
{
    const ytShorts = getVideo();
    if ( ytShorts === null ) return false;
  
    ytShorts.currentTime = 0;
}

export function mute()
{
    const muteButton = getMuteButton();
    if ( muteButton === null ) return;
}