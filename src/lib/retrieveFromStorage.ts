import { DEFAULT_KEYBINDS, DEFAULT_OPTIONS, storage } from "./declarations"
import { PolyDictionary, StringDictionary } from "./definitions"

export function retrieveOptionsFromStorage( setter: ( options: PolyDictionary ) => void )
{
  const localStorageOptions = JSON.parse( localStorage.getItem("yt-extraopts") as string )
  setter( localStorageOptions )
  
  storage.get( ["extraopts"] )
  .then( ( {extraopts} ) => {
    if ( !extraopts ) throw Error("[BYS] :: Extra Options couldnt be loaded from storage, using defaults")
    
    for ( const [ option, value ] of Object.entries( DEFAULT_OPTIONS ) ) {
      if ( extraopts[ option ] ) continue // * this may be an issue later on if we WANT falsy values as viable values
      extraopts[ option ] = value
    }
    
    if ( extraopts !== localStorageOptions ) 
      localStorage.setItem( "yt-extraopts", JSON.stringify( extraopts ) )
    
    setter( extraopts )
  })
  .catch( err => {
    setter( DEFAULT_OPTIONS )
  } )
}

export function retrieveKeybindsFromStorage( setter: ( keybinds: StringDictionary ) => void )
{
  const localStorageKeybinds = JSON.parse( localStorage.getItem("yt-keybinds") as string )
  setter( localStorageKeybinds )
  
  storage.get( ["keybinds"] )
  .then( ( {keybinds} ) => {
    if ( !keybinds ) throw Error("[BYS] :: Keybinds couldnt be loaded from storage, using defaults")

    for ( const [ option, value ] of Object.entries( DEFAULT_KEYBINDS ) ) {
      if ( keybinds[ option ] ) continue // * this may be an issue later on if we WANT falsy values as viable values
      keybinds[ option ] = value
    }
    
    if ( keybinds !== localStorageKeybinds ) 
      localStorage.setItem( "yt-keybinds", JSON.stringify( keybinds ) )
    
    setter( keybinds )

  })
  .catch( err => {
    setter( DEFAULT_KEYBINDS )
  } )
}