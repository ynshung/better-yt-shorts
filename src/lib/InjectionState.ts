// todo: change values out for localised strings
export enum InjectionItemsEnum {
  EXISTING_EVENTS = "Events",
  ACTION_ELEMENT = "Action Elements",
  PROGRESS_BAR = "Progress Bar",
  VOLUME_SLIDER = "Volume Slider",
  INFO = "Info",
}

export enum InjectionStateEnum {
  FAILED = 0,
  NEW,
  SUCCESS,
}

const MAX_NUMBER_OF_ATTEMPTS = 3;

export class InjectionStateUnit {
  name: InjectionItemsEnum;
  state: InjectionStateEnum;
  callback: () => void;
  attempts: number;

  constructor(name: InjectionItemsEnum, callback: () => void) {
    this.name = name;
    this.callback = callback;
    this.state = InjectionStateEnum.NEW;
    this.attempts = 0;
  }

  logError(err: Error) {
    console.group("%cBYS Injection Error", "color: #ff7161;");
    console.log(
      `%cError while injecting "${this.name}"\n\nInjection was attempted ${this.attempts} times.\n\nMessage: "${err.message}"`,
      "color: #ff7161;",
    );
    console.groupEnd();
  }

  inject() {
    if (this.attempts > MAX_NUMBER_OF_ATTEMPTS) return;

    let state = InjectionStateEnum.SUCCESS;
    this.attempts++;

    //prettier-ignore
    try {
      this.callback();
    } 
    catch (err) {
      if (this.attempts === MAX_NUMBER_OF_ATTEMPTS) 
      {
        this.logError(err as Error);
      }

      state = InjectionStateEnum.FAILED;
    } 
    finally {
      this.state = state;
      // eslint-disable-next-line no-unsafe-finally
      return this.state === InjectionStateEnum.SUCCESS;
    }
  }
}

export class InjectionState {
  units: InjectionStateUnit[];
  id: number;
  injectionSucceeded: boolean;

  constructor(id: number, ...units: InjectionStateUnit[]) {
    this.units = units;
    this.id = id;
    this.injectionSucceeded = false;
  }

  injectRemainingItems() {
    if (this.injectionSucceeded) return;

    this.injectionSucceeded = true;

    for (const unit of this.units) {
      if (unit.state !== InjectionStateEnum.SUCCESS) {
        // eslint-disable-next-line prettier/prettier
        this.injectionSucceeded = ( unit.inject() && this.injectionSucceeded ) as boolean ;
      }
    }
  }
}

/**
 * Assumes set items are objects that have an `id` prop
 * @returns {@link InjectionState}, or {null} if unfound
 */
export function findInjectionStateInSet(id: number, set: Set<InjectionState>) {
  //prettier-ignore
  for ( const item of set )
    if ( item.id === id )
      return item;

  return null;
}
