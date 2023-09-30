import { saveOptionsToStorage } from "./SaveToStorage"
import { getOverlay } from "./getters" 

export function handleHideShortsOverlay( options: any )
{
  const overlay = getOverlay()
  if ( overlay === null ) return

  if ( options.hideShortsOverlay )
    overlay.classList.add( "betterYT-hidden" )
  else
    overlay.classList.remove( "betterYT-hidden" )
}

export function setHideShortsOverlay( newValue: boolean, options: any )
{
  saveOptionsToStorage( { ...options, hideShortsOverlay: newValue } )
}