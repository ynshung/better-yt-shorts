import BROWSER from "./browser"

export function handleColorScheme( isDarkScheme: boolean )
{
  console.log( `[BYS] :: processing scheme (recognised as ${ isDarkScheme ? "DARK" : "LIGHT" })` )

  // todo  - create dark/light icons and change these here.
  if ( isDarkScheme )
    BROWSER.browserAction.setIcon({
      path: {
        "128": `bys-128.png`,
        "48":  `bys-48.png`,
        "32":  `bys-32.png`,
        "16":  `bys-16.png`,
      }
    })

  else
    BROWSER.browserAction.setIcon({
      path: {
        "128": `bys-128.png`,
        "48":  `bys-48.png`,
        "32":  `bys-32.png`,
        "16":  `bys-16.png`,
      }
    })
    
}