import BROWSER from "../background/browser";
import { ChangedObjectStateEnum } from "./definitions";

/**
 * Expects an object (the keybindsState or optionsState for exmaple)
 * This is to be received by the content script, allowing immediate updates to the binds/options
 * @param message
 */

export function pingChanges(
  objectEnum: ChangedObjectStateEnum,
  message: object,
) {
  (async () => {
    const [tab] = await BROWSER.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    const key = ChangedObjectStateEnum[objectEnum].toLowerCase() ?? null;

    const content: { [key: string]: object } = {};
    content[key] = message;

    await BROWSER.tabs.sendMessage(tab.id as number, content); // ! - see if this works in firefox

    // do something with response here, not outside the function
    console.log(`[BYS] :: Saving Changes`);
  })().catch(() => {});
}
