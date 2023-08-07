export type NumberDictionary = {
  [key: string]: number
} | null

export type StringDictionary = {
  [key: string]: string
} | null

export type PolyDictionary = {
  [key: string]: any
} | null

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
  KEYBINDS = 0,
  OPTIONS
}

export enum ChangedObjectStateEnum {
  KEYBINDS = 0,
  OPTIONS
}