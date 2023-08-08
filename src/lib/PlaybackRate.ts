import { getCurrentId, getPlaybackElement } from "./getters"

export function setPlaybackRate( state: any )
{
  const id = getCurrentId()
  const playBackElement = getPlaybackElement() as HTMLElement

  if ( playBackElement === null ) return false

  playBackElement.innerText = `${state.playbackRate}x`

  return true
}

export function setTimer( currTime: number, duration: number )
{
  const id = getCurrentId()
  if ( document.getElementById(`ytTimer${id}`) === null ) return false

  const timerElement = document.getElementById( `ytTimer${id}` ) as HTMLElement
  
  timerElement.innerText = `${currTime}/${duration}s`

  return true
}