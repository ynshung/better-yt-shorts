import { DEFAULT_KEYBINDS, DEFAULT_OPTIONS, setKeybinds, setOptions, storage } from "./declarations"

/**
 * Resets keybinds to their factory values in local and storage as well as the live binds
 */
export function resetKeybinds()
{
  storage.set( { "keybinds" : DEFAULT_KEYBINDS } )
  localStorage.setItem( "yt-keybinds", JSON.stringify( DEFAULT_KEYBINDS ) )
  setKeybinds( {...DEFAULT_KEYBINDS} )
  
  console.log( `[BYS] :: Reset Keybinds to Defaults!` )
}

/**
 * Resets options to their factory values in local and storage as well as the live binds
 */
export function resetOptions()
{
  storage.set( { "extraopts" : DEFAULT_OPTIONS } )
  localStorage.setItem( "yt-extraopts", JSON.stringify( DEFAULT_OPTIONS ) )
  setOptions( {...DEFAULT_OPTIONS} )
  
  console.log( `[BYS] :: Reset Options to Defaults!` )
}