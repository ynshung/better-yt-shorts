export type NumberDictionary = {
  [key: string]: number
} | null

export type StringDictionary = {
  [key: string]: string
} | null

export type StrictStringDictionary = {
  [key: string]: string
}

export type PolyDictionary = {
  [key: string]: any
} | null

export type BooleanDictionary = {
  [key: string]: any
} | null

export type StrictPolyDictionary = {
  [key: string]: any
}

export type DefaultsDictionary = {
  [key: string]: any
}

export interface StateObject {
  [key: string]: any
}

export interface OptionsDictionary {
  [key: string]: PolyDictionary
}

export enum PopupPageNameEnum {
  UNKNOWN  = 0,
  KEYBINDS,
  OPTIONS,
  FEATURES,
}

export enum ChangedObjectStateEnum {
  KEYBINDS = 0,
  OPTIONS,
  SETTINGS,
  FEATURES,
}