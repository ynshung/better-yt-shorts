import BROWSER from "../background/browser";
import { ChangedObjectStateEnum } from "./definitions";
import { getEnumWithString, getKeyFromEnum } from "./utils";

/**
 * Expects an object (the keybindsState or optionsState for exmaple)
 * This is to be received by the content script, allowing immediate updates to the binds/options
 * @param message 
 */

export async function pingChanges( objectEnum: ChangedObjectStateEnum, message: Object )
{
  const [tab]    = await BROWSER.tabs.query({active: true, lastFocusedWindow: true})
  const key      = getKeyFromEnum( ChangedObjectStateEnum, objectEnum, null )

  const content  = {} as any
  content[ key ] = message

  const response = await BROWSER.tabs.sendMessage( tab.id, content ); // ! - see if this works in firefox

  // do something with response here, not outside the function
  console.log( `[BYS] :: Updating Keybinds` )
}