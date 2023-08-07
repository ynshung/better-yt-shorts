import { pingChanges } from "./chromeEmitters"
import { DEFAULT_KEYBINDS, DEFAULT_OPTIONS, storage } from "./declarations"
import { ChangedObjectStateEnum } from "./definitions"

/**
 * Resets keybinds to their factory values in local and storage as well as the live binds
 */
export function resetKeybinds()
{
  storage.set( { "keybinds" : DEFAULT_KEYBINDS } )
  localStorage.setItem( "yt-keybinds", JSON.stringify( DEFAULT_KEYBINDS ) )
  console.log( `[BYS] :: Reset Keybinds to Defaults!` )

  pingChanges( ChangedObjectStateEnum.KEYBINDS, DEFAULT_KEYBINDS )
}

/**
 * Resets options to their factory values in local and storage as well as the live binds
 */
export function resetOptions()
{
  storage.set( { "extraopts" : DEFAULT_OPTIONS } )
  localStorage.setItem( "yt-extraopts", JSON.stringify( DEFAULT_OPTIONS ) )
  console.log( `[BYS] :: Reset Options to Defaults!` )
  
  pingChanges( ChangedObjectStateEnum.OPTIONS, DEFAULT_OPTIONS )
}