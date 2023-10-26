export type NumberDictionary = {
  [key: string]: number;
};

export type StringDictionary = {
  [key: string]: string;
};

export type PolyDictionary = {
  [key: string]: string | boolean | number;
};

export type BooleanDictionary = {
  [key: string]: boolean;
};

export type IconDictionary = {
  [key: string]: {
    active: React.JSX.Element;
    inactive: React.JSX.Element;
    name: string;
  };
};

export interface StateObject {
  [key: string]: string | boolean | number | Set<number> | null;
}

export interface OptionsDictionary {
  [key: string]: {
    desc: string;
    type: string;
    min?: number;
    max?: number;
  };
}

export enum PopupPageNameEnum {
  UNKNOWN = 0,
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
