import React, { useState } from 'react'
import { DEFAULT_KEYBINDS, DISABLED_BIND_STRING, KEYBINDS_ORDER } from '../lib/declarations'
import EditButton from './EditButton'
import { resetKeybinds } from '../lib/ResetDefaults'
import { StringDictionary } from '../lib/definitions'
import EditModal from './EditModal'

interface Props
{
  setKeybindsState: ( keybinds: () => StringDictionary ) => void
  keybindsState: StringDictionary
}

export default function KeybindsPage( { setKeybindsState, keybindsState }: Props ) {

  const [ isModalOpen, setIsModalOpen ] = useState( false )
  const [ selectedCommand, setSelectedCommand ] = useState( "Seek Backward" )

  const modalProps = {
    selectedCommand,
    isModalOpen,
    setIsModalOpen,
    keybindsState,
    setKeybindsState
  }

  function handleResetKeybinds()
  {
    setKeybindsState( () => {
      resetKeybinds()
      return DEFAULT_KEYBINDS
    } )
  }

  function populateKeybindsPage()
  {
    if ( keybindsState === null ) return <></>

    return KEYBINDS_ORDER.map( ( command: string ) => {
      const bind = keybindsState[ command ]
      const editButtonProps = {
        keybindsState, setKeybindsState, command, setSelectedCommand, setIsModalOpen
      }

      return (
        <tr key={crypto.randomUUID()}>
          <td>{command}</td>
          <td>
            <div className="keybind-wrapper">
              <span id={`${command}-span`} className="keybind-span">{bind}</span>
            </div>
          </td>
          <td>
            <EditButton {...editButtonProps}/>
          </td>
        </tr>
      )
    } )
  }

  return (
    <>
      <h3 className="popup_subheading prevent-selection">Keybinds</h3>

      <EditModal {...modalProps}/>
      
      <table style={{width: '100%'}} data-theme="light" id="keybind-table">
        <tbody>
          <tr className="prevent-selection">
            <th>Command</th>
            <th>Key</th>
            <th></th>
          </tr>

          { populateKeybindsPage() }
        </tbody>
      </table>

      <footer className="--flex-button-container">
        <button onClick={ handleResetKeybinds } className="--flex-button warn">Reset Keybinds</button>
      </footer>
    </>
  )
}
