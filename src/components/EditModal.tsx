import { useEffect, useRef, useState } from 'react'
import Separator from './Separator'
import { DEFAULT_PRESSED_KEY, DISABLED_BIND_STRING, EXCLUDED_KEY_BINDS } from '../lib/declarations'
import { StringDictionary } from '../lib/definitions'
import { saveKeybindsToStorage } from '../lib/SaveToStorage'


interface Props
{
  selectedCommand: string,
  isModalOpen: boolean,
  setIsModalOpen: ( newState: boolean ) => void,
  keybindsState: StringDictionary,
  setKeybindsState: any, // ! - use proper type
}

export default function EditModal( { selectedCommand, isModalOpen, setIsModalOpen, keybindsState, setKeybindsState }: Props ) {

  const [ inputSuccessString, setInputSuccessString ] = useState<string | null>( null )
  const [ inputErrorString,   setInputErrorString ]   = useState<string | null>( null )
  const [ pressedKey, setPressedKey ] = useState( DEFAULT_PRESSED_KEY ) // ? this is only to display this to user

  // this only exists to autofocus so inputs are immediate
  const modalRef = useRef( null )
  useEffect( () => {
    if ( !isModalOpen ) return

    const el = modalRef?.current as HTMLElement | null
    if ( el )
      el.focus()
    
  }, [ isModalOpen ] )

  useEffect( () => {
    if ( 
      pressedKey === DEFAULT_PRESSED_KEY  ||
      pressedKey === DISABLED_BIND_STRING
    ) return
    
    setInputErrorString( null )
    setInputSuccessString( null )
    
    if ( canUseKey() ) 
      setInputSuccessString( `"${pressedKey}" can be used!` )

  }, [ pressedKey ] )

  let currentKey = ""
  if ( keybindsState !== null )
    currentKey = keybindsState[ selectedCommand ]
  
  function handleCloseModal()
  {
    setIsModalOpen( false )

    setInputErrorString( null )
    setInputSuccessString( null )
    setPressedKey( DEFAULT_PRESSED_KEY )
  }

  function handleSaveBind()
  {
    if ( canUseKey() )
    {
      setKeybindsState( () => {
        const newState = {...keybindsState}
        newState[ selectedCommand ] = pressedKey 
        
        saveKeybindsToStorage( newState )
        console.log( `[BYS] :: Bound key "${pressedKey}" to ${selectedCommand}` )

        return newState 
      } )
    }

    setIsModalOpen( false )

    setInputErrorString( null )
    setInputSuccessString( null )
    setPressedKey( DEFAULT_PRESSED_KEY )
  }

  function canUseKey()
  {
    if ( EXCLUDED_KEY_BINDS.includes( pressedKey ) )
    {
      setInputErrorString( `"${pressedKey}" cannot be used ` )
      return false 
    }
    if ( Object.values( keybindsState as Object ).includes( pressedKey ) )
    {
      setInputErrorString( `"${pressedKey}" is already in use` )
      return false 
    }

    return true
  }

  function showInputInfoString()
  {
    // either show the success, failure or 
    if ( inputSuccessString ) return <div className="--modal-input-success">{`👍 ${inputSuccessString}`}</div>
    if ( inputErrorString )   return <div className="--modal-input-error">{`❌ ${inputErrorString}`}</div>
    
    return <div className="--modal-input-error">{"\u00A0"}</div>
  }

  function handleDisableBind()
  {
    setKeybindsState( () => {
      const newState = {...keybindsState}
      newState[ selectedCommand ] = DISABLED_BIND_STRING 
      
      saveKeybindsToStorage( newState )
      console.log( `[BYS] :: Disabled binding "${pressedKey}" that was bound to ${selectedCommand}` )

      setInputSuccessString( `"${selectedCommand}" was disabled!` ) 
      return newState 
    } )

    setPressedKey( DISABLED_BIND_STRING )
        
  }

  function getCurrentKeybindString()
  {
    if ( currentKey === DISABLED_BIND_STRING )
      return <>Keybind is currently disabled</>

    return <>Current bind is <span>{currentKey}</span></>
  }

  function showConfirmButton()
  {
    if ( !inputSuccessString ) return <></>

    return (
      <button className="--flex-button good" onClick={handleSaveBind}>Confirm</button>
    )
  }

  return (
    <dialog 
      className="--modal" 
      open={ isModalOpen } 
      style={ { display: (isModalOpen) ? "flex" : "none" }}
      ref={modalRef}
      onKeyDown={e => setPressedKey( e.code )}
    >
      <div className="--modal-content">

        <span className="--modal-header">
          <span className="--modal-header-text">
            Edit binding for 
            <span className="--modal-command">{selectedCommand}</span>
          </span>

          <span className="close-btn" onClick={handleCloseModal}>×</span>
        </span>

        <Separator/>

        <div className="input-wrapper">
          <label htmlFor="keybind-input" className="prevent-selection --modal-label">
            {
              getCurrentKeybindString()
            }
          </label>
          <span className="">{pressedKey}</span>
          {showInputInfoString()}
          <div className= "--flex-button-container">
            <button className="--flex-button" onClick={handleDisableBind}>Disable Bind</button>
            {showConfirmButton()}
          </div>
          <div className="prevent-selection key-combo-warning">Does not support key combinations</div>
        </div>
      </div>
    </dialog>
  )
}
