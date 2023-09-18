import BROWSER from "../background/browser";
import { DefaultsDictionary, NumberDictionary, OptionsDictionary, PolyDictionary, StateObject, StringDictionary } from "./definitions";

export const VERSION = BROWSER.runtime.getManifest().version

export const DEFAULT_KEYBINDS: DefaultsDictionary = {
  "Seek Backward":   "ArrowLeft",
  "Seek Forward":    "ArrowRight",
  "Decrease Speed":  "KeyU",
  "Reset Speed":     "KeyI",
  "Increase Speed":  "KeyO",
  "Decrease Volume": "Minus",
  "Increase Volume": "Equal",
  "Toggle Mute":     "KeyM",
  "Next Frame":      "Comma",
  "Previous Frame":  "Period",
  "Restart Short":  "KeyJ",
  "Next Short":      "KeyS", 
  "Previous Short":  "KeyW",
};
export const KEYBINDS_ORDER: DefaultsDictionary = [
  "Seek Backward",
  "Seek Forward",
  "Decrease Speed",
  "Reset Speed",
  "Increase Speed",
  "Decrease Volume",
  "Increase Volume",
  "Toggle Mute",
  "Next Frame",
  "Previous Frame",
  "Restart Short",
  "Next Short",
  "Previous Short",
]

export const DEFAULT_OPTIONS: DefaultsDictionary = {
  // add new defaults for your option here
  skip_enabled: false,
  skip_threshold: 500,
  seek_amount: 5,
  automatically_open_comments: false,
  show_links_in_comments: false,
}
export const OPTIONS_ORDER: DefaultsDictionary = [
  "seek_amount",
  "automatically_open_comments",
  "skip_enabled",
  "skip_threshold",
  "show_links_in_comments",
]


export const OPTION_DICTIONARY: OptionsDictionary = {
  // add details for the option (the input element type, the bounds (min/max), etc)
  skip_enabled: 
  {
    desc: "Automatically skip shorts with fewer likes?",
    type: "checkbox",
  },
  skip_threshold: 
  {
    desc: "Skip shorts with fewer than this many likes:",
    type: "number",
    min:  0
  },
  seek_amount:
  {
    desc: "Seek amount in seconds",
    type: "number",
    min:  0,
    max: 60,
  },
  automatically_open_comments:
  {
    desc: "Open comments on new shorts automatically?",
    type: "checkbox",
  },
  show_links_in_comments:
  {
    desc: "Make links in the comments clickable?",
    type: "checkbox",
  }
}

export function setKeybind( previousState: StringDictionary, command: string, newKey: string ): StringDictionary
{
  if ( previousState === null ) return null

  const newKeybinds = {...previousState}
  newKeybinds[ command ] = newKey

  return newKeybinds
}

export function setOption( previousState: PolyDictionary, option: string, value: string ): StringDictionary
{
  if ( previousState === null ) return null

  const newOptions = {...previousState}
  newOptions[ option ] = value

  return newOptions
}

export function setFeature( previousState: PolyDictionary, feature: string, value: string ): StringDictionary
{
  if ( previousState === null ) return null

  const newFeatures = { ...previousState }
  newFeatures[ feature ] = value

  return newFeatures
}


export const storage = BROWSER.storage.local

export const DEFAULT_STATE = {
  id          : 0,
  topId       : 0,
  playbackRate: 1,
  lastTime    : -1, // ? this is for checking if items were injected 
  openedCommentsId: -1,

  injectedItems: new Set(),
  
  actualVolume: null,
  skippedId   : null,
  
  muted       : false,
} as StateObject

// ! - add settings
export const DEFAULT_SETTINGS = {
  volume: 0.5, 
  autoplay: false,
}

export const DEFAULT_FEATURES = {
  "Autoplay":      true,
  "Progress Bar":  true,
  "Timer":         true,
  "Playback Rate": true,
  "Volume Slider": true,
  "Keybinds": true,
}

export const FEATURES_ORDER: DefaultsDictionary = [
  "Autoplay",    
  "Progress Bar",
  "Timer",       
  "Playback Rate",
  "Volume Slider",
  "Keybinds",
]

// todo  - add formats from other langs (note: dont include duplicate keys)#
export const NUMBER_MODIFIERS: NumberDictionary = {
    // English
  "b":   1_000_000_000,
  "m":   1_000_000,
  "k":   1_000,

  // Italian
  "mln": 1_000_000,

  // Indian English
  "lakh": 100_000,

  // Portuguese
  "mil": 1_000,

  // French
  "mio": 1_000_000,
  "md":  1_000,

  // German
  "mrd": 1_000_000_000,
  "tsd": 1_000,

  // Japanese
  "億":  1_000_000_000,
  "万":  10_000,

  // Chinese (Simplified)
  "亿":  1_000_000_000,

  // Chinese (Traditional)
  "萬":  10_000,

  // Russian
  "млн": 1_000_000,
  "тыс": 1_000,

  // Hindi
  "करोड़": 10_000_000,
  "लाख":  100_000,

  // Arabic
  "مليون":   1_000_000,
  "مليار":   1_000_000_000,
  "ألف":     1_000,

  // Korean
  "억":  100_000_000,
  "만":  10_000,

  // Turkish
  "milyon":    1_000_000,
  "milyar":    1_000_000_000,
  "bin":       1_000,

  // Vietnamese
  "triệu":    1_000_000,
  "tỷ":       1_000_000_000,
  "nghìn":    1_000,

  // Thai
  "ล้าน":    1_000_000,
  "พันล้าน": 1_000_000_000,
  "พัน":     1_000,

  // Dutch
  "mld":  1_000_000_000,

  // Greek
  "εκ":   1_000_000,
  "δισ":  1_000_000_000,
  "χιλ":  1_000,

  // Swedish
  "mn":   1_000_000,
  "t":    1_000,
}

export const EXCLUDED_KEY_BINDS = [
  'Backspace',
  'Enter',
  'NumpadEnter',
  'Escape',
  'Tab',
  'Space',
  'PageUp',
  'PageDown',
  'ArrowUp',
  'ArrowDown',
  'F13',             // printscreen
  'MetaLeft',        // windows/command
  'MetaRight',

  'ControlLeft',
  'ControlRight',
  'ShiftLeft',
  'ShiftRight',
  'AltLeft',
  'AltRight',
]

export const DEFAULT_PRESSED_KEY = "Press a Key"
export const DISABLED_BIND_STRING = "<disabled>"

export const VOLUME_INCREMENT_AMOUNT = 0.025