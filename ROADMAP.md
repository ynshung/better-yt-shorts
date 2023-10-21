<div align="center">

![BYS Icon](./src/assets/icons/bys-128.png)

# Better YouTube Shorts v3 - Roadmap
</div>

## Current Changes and Improvements from v2
- Options and Keybinds now take effect immediately
- Added "tabbed" page view for the popup to split up keybinds, options, and anything else in the future
- Fixed issue where volume would ignore slider sporadically
- Added "disable key bind" option in the edit keybind modal
- You can now reset options to defaults (options = extraoptions)
- Added "settings" object to storage, to contain excess content-script settings like volume and autoplay
- Added "features" object to storage, you can now enable and disable certain content script UI elements (autoplay, volume, etc)


## Codebase Format
- the `lib` directory contains exports for both the content and popup scripts. I recommend containing each bit of unrelated functionality in their own files.
  - This excludes the `declarations.ts`, which should contain global variables used throughout the program for easy access
  - All global types (including interfaces and enums) are defined in `definitions.ts`
  - `utils.ts` is a file for utility functions that are generic. Basically think anything that could be transferred to a different project 
  - Finally, theres `getters.ts` which is for selector functions (eg *getVideo()*)
- the `components` directory is for react components. Try splitting up your TSX into reusable components if possible (its not too big of a deal if you cant mind you)
- Using an npm module for the icons (react-icons). Ideally, they should be imported from there (also stick to the material design ones for consistency)

--- 
## General
- Test with Firefox (I can't seem to get it to load at the moment, but the [compatibility checker](https://www.extensiontest.com/) agrees it is a compatible extension)
- Update README content and screenshots

## Content Script
- ~~Separate Popup and Content CSS into their own files (prevent weird side effects)~~
- ~~Implement the seek bar~~
- ~~Implement the volume slider~~
  - ~~Save setting to storage~~
  - Slider should automatically toggle youtube's built in mute button when on 0 or >0 respectively (just do a synthetic click on the btn)
- Clean up code; move each element to their own script
- ~~⚠️ **error from recent chrome update may be unfixed**~~
- Fix styling for autoplay (when comments are open, doesnt follow the transparent effect of other buttons)

## Popup
- ~~Add missing functionality from more recent main branch patches (copy from the main branch):~~
  - ~~Option to **auto open comments**, and appropriate logic~~
  - ~~Option to **change the seek amount**~~
- ~~Add proper icons for the tabs see [this icon pack](https://fonts.google.com/icons)~~
- ~~Tweak styling for the indicators (padding and margins look off)~~
- ⚠️ **Update logo when a new logo is decided if needed**
- Remove console logs **that aren't prefaced with "[BYS] :: "**
- ~~Fix issue with number and text inputs on the option page losing focus on input (on change changes the state, perhaps we need to instead update on loss of focus, not change)~~

## Language Support
Not a priority of mine, but I do have an idea of how to accomodate other languages, but its a bit finnicky.
It'd also require help from native localisers ideally.
Essentially, we could have an object of "terms" (could this be JSON?), with the key being the language code from `navigator.language`
