import { DEFAULT_OPTIONS, OPTIONS_ORDER, OPTION_DICTIONARY, setOption, storage } from '../lib/declarations'
import { determineInputType } from '../lib/utils'
import { PolyDictionary } from '../lib/definitions'
import { resetOptions } from '../lib/ResetDefaults'
import { saveOptionsToStorage, saveSettingsToStorage } from '../lib/SaveToStorage'

interface Props
{
  optionsState: PolyDictionary
  setOptionsState: ( options: ( previousState: PolyDictionary ) => PolyDictionary ) => void
}

export default function OptionsPage( { optionsState, setOptionsState }: Props ) {
  // this only exists to rerender on change

  function handleResetOptionsClick()
  {
    setOptionsState( () => {
      resetOptions()
      return DEFAULT_OPTIONS  
    } )
  }

  function handleOptionChange( e: any, option: string )
  {
    if ( optionsState === null ) return

    const target = e.target as HTMLInputElement 
    let value: any = target.value

    // this may need changed depending on different input types
    if ( target.type === "checkbox" )          value = target.checked
    else if ( !isNaN( target.valueAsNumber ) ) value = target.valueAsNumber

    if ( value === null ) return console.warn( `[BYS] :: Option set handler tried to set option ${option} to null` )

    // if value is number, handle min and max ranges
    if ( [ "number", "range" ].includes( target.type ) )
    {
      if ( target?.max !== "" )
        if ( +value > +target.max ) 
          value = +target.max
        
      if ( target?.min !== "" )
        if ( +value < +target.min ) 
          value = +target.min
    }
    
    setOptionsState( () => {
      const newState = setOption( optionsState, option, value )

      saveOptionsToStorage( newState )
      console.log( `[BYS] :: Set Option "${option}" to ${value}` )

      return newState
    } )

  }

  function populateOptionsPage()
  {
    if ( optionsState === null ) return <></>

    return OPTIONS_ORDER.map( ( option: string, i: number ) => {
      const value = optionsState[ option ]
      
      if ( OPTION_DICTIONARY === null ) return <></>

      const type = determineInputType( value )

      if ( optionsState === null ) return

      return (
        <div key={i} className="label_input--row">
          <label htmlFor={`option_input_${option}`}>{ (OPTION_DICTIONARY !== null ) ? "" + OPTION_DICTIONARY[ option ]?.desc : option }</label>
          <input 
            id={`extra_options_${option}`} 
            type={ OPTION_DICTIONARY[ option ]?.type ?? determineInputType( value ) } 
            name={`option_input_${option}`} 

            min={ OPTION_DICTIONARY[ option ]?.min ?? null }
            max={ OPTION_DICTIONARY[ option ]?.max ?? null }

            value={   OPTION_DICTIONARY[ option ]?.type !== "checkbox" ? optionsState[ option ] : undefined }
            checked={ OPTION_DICTIONARY[ option ]?.type === "checkbox" ? optionsState[ option ] : undefined }

            onChange = { e => handleOptionChange( e, option ) }
          />
        </div>
    )
    } )
  }

  return (
    <>
      <h3 className="prevent-selection popup_subheading">Extra Options</h3>

      <div id="extra_options">
        { populateOptionsPage() }
      </div>

      <footer className="--flex-button-container">
        <button onClick={ handleResetOptionsClick } className="--flex-button warn">Reset Options</button>
        <a href="https://github.com/ynshung/better-yt-shorts" target="_blank">
          <span className="--global-footer-link">Github</span>
        </a>
      </footer>
    </>
  )
}
