import BROWSER from "../background/browser";
import { ChangedObjectStateEnum } from "./definitions";
import { getKeyFromEnum } from "./utils";

/**
 * Expects an object (the keybindsState or optionsState for exmaple)
 * This is to be received by the content script, allowing immediate updates to the binds/options
 * @param message
 */

export function pingChanges(
  objectEnum: ChangedObjectStateEnum,
  message: Object,
) {
  (async () => {
    const [tab] = await BROWSER.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    const key = getKeyFromEnum(ChangedObjectStateEnum, objectEnum, null);

    const content = {} as any;
    content[key] = message;

    const response = await BROWSER.tabs.sendMessage(tab.id as number, content); // ! - see if this works in firefox

    // do something with response here, not outside the function
    console.log("[BYS] :: Saving Changes");
  })().catch((err) => {});
}
